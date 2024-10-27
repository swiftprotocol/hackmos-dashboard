import { User } from '@/components/app/user-table'
import { App } from '@/contexts/auth'
import signMsg from '@/util/sign'
import truncateAddress, { truncateText } from '@/util/truncate'
import { toBech32 } from '@cosmjs/encoding'
import camelcaseKeys from 'camelcase-keys'
import renderTemplate, { resolveValidatorImage } from './templater'

import type { QueryDelegationRewardsResponse } from 'cosmjs-types/cosmos/distribution/v1beta1/query'
import type { QueryValidatorDelegationsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query'
import EXAMPLE_DATA from './example'

const api = 'https://cosmoshub.lava.build:443'

interface Article {
  title: string
  content: string
  href: string
}

interface Validator {
  address: string
  name: string
  image: string
  commission: number
  balances: {
    staked: number
    rewards: number
  }
}

function formatATOM(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currencyDisplay: 'code',
    currency: 'EUR',
  })
    .format(amount)
    .replace('EUR', 'ATOM')
    .replace(/^([A-Z]*)\s*(.+)$/, '$2 $1')
    .trim()
}

function formatUSD(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

export default async function fire(
  publicKeyBuffer: ArrayBuffer,
  privateKeyBuffer: ArrayBuffer,
  app: App,
  article: Article
) {
  const publicKeyHex = Buffer.from(publicKeyBuffer).toString('hex')
  const privateKeyHex = Buffer.from(privateKeyBuffer).toString('hex')

  const signature = await signMsg(privateKeyBuffer, app.id.toString())
  const res = await fetch(
    process.env.NEXT_PUBLIC_SWIFT_API + '/notify/auth/all',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pubkey: publicKeyHex,
        signature,
      }),
    }
  )
  const data = await res.json()
  const users: User[] | undefined = data.authorizations

  if (!users) throw new Error('No users found')

  // Get HTML template
  const html = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + '/template.html'
  ).then((res) => res.text())
  const css = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL! + '/optimized.css'
  ).then((res) => res.text())

  let price
  try {
    const prices = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=atom&vs_currencies=usd`,
      { mode: 'no-cors' }
    ).then((res) => res.json())
    price = prices.atom.usd
  } catch (e) {
    price = 0
  }

  // Get latest passed governance proposal on Cosmos Hub
  const proposalRes = await fetch(
    api +
      '/cosmos/gov/v1/proposals?pagination.limit=1&pagination.reverse=true&proposal_status=3'
  )
  const proposalJson = await proposalRes.json()
  const proposal = proposalJson.proposals[0]

  // Generate a template for each user
  const templatesPromise = users.map(async (user) => {
    const address = toBech32(
      'cosmos',
      new Uint8Array(Buffer.from(user.owner, 'hex'))
    )

    let delegationData

    if (address !== 'cosmos1nsk7c9k2wuw5pwzaw7jeljcc625vtx5gmc3pnt') {
      // Query delegations
      const delegationRes = await fetch(
        api + '/cosmos/staking/v1beta1/delegations/' + address
      )
      const delegationJsonCase = await delegationRes.json()
      const delegationJson = camelcaseKeys(
        delegationJsonCase
      ) as QueryValidatorDelegationsResponse

      const delegations = delegationJson.delegationResponses
      const validatorsPromise = delegations.map(async (delegation: any) => {
        const valRes = await fetch(
          api +
            '/cosmos/staking/v1beta1/validators/' +
            delegation.delegation.validator_address
        ).then((res) => res.json())
        const val = valRes.validator

        // Fetch outstanding rewards
        const rewardsRes: QueryDelegationRewardsResponse = await fetch(
          api +
            '/cosmos/distribution/v1beta1/delegators/' +
            address +
            '/rewards/' +
            val.operator_address
        ).then((res) => res.json())

        const rewards = rewardsRes.rewards.find((r: any) => r.denom === 'uatom')

        const result: Validator = {
          address: val.operator_address,
          name: val.description.moniker,
          image: resolveValidatorImage(val.operator_address),
          commission: val.commission.commission_rates.rate,
          balances: {
            staked: parseInt(delegation.balance.amount) / 1_000_000,
            rewards: rewards ? parseInt(rewards.amount) / 1_000_000 : 0,
          },
        }

        return result
      })

      const validators = await Promise.all(validatorsPromise)

      delegationData = validators.map((validator) => {
        return {
          color: '#000',
          logo: validator.image,
          name: validator.name,
          staked_balance: {
            amount: formatATOM(validator.balances.staked),
            usd: formatUSD(validator.balances.staked * price),
          },
          rewards: {
            amount: formatATOM(validator.balances.rewards),
            usd: formatUSD(validator.balances.rewards * price),
          },
          commission: Number(validator.commission).toLocaleString(undefined, {
            style: 'percent',
            minimumFractionDigits: 1,
          }),
        }
      })
    } else {
      delegationData = EXAMPLE_DATA.delegations
    }

    // Convert the vote counts to numbers
    const yes_count = parseInt(proposal.final_tally_result?.yes_count)
    const no_count = parseInt(proposal.final_tally_result?.no_count)
    const abstain_count = parseInt(proposal.final_tally_result?.abstain_count)
    const no_with_veto_count = parseInt(
      proposal.final_tally_result?.no_with_veto_count
    )

    // Convert the tally into parts of 100%
    const totalVotes = yes_count + no_count + abstain_count + no_with_veto_count
    const votes = {
      yes: ((yes_count / totalVotes) * 100).toFixed(1),
      no: ((no_count / totalVotes) * 100).toFixed(1),
      abstain: ((abstain_count / totalVotes) * 100).toFixed(1),
      nwv: ((no_with_veto_count / totalVotes) * 100).toFixed(1),
    }

    console.log(votes)

    const data = {
      css: css,
      $org: app.name,
      user: truncateAddress(address),
      logo: process.env.NEXT_PUBLIC_BASE_URL + '/apps/' + app.id + '.svg',
      banner: process.env.NEXT_PUBLIC_BASE_URL + '/banner.png',
      delegations: delegationData,
      governance: [
        {
          id: proposal.id,
          name: proposal.title,
          description: truncateText(proposal.summary, 350),
          votes,
        },
      ],
      article,
    }

    const rendered = renderTemplate(html, data)

    return { address, rendered }
  })

  const templates = await Promise.all(templatesPromise)

  templates.forEach((template) => {
    fetch(process.env.NEXT_PUBLIC_SWIFT_API + '/notify/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: template.address,
        signature,
        pubkey: publicKeyHex,
        message: {
          subject: article.title,
          html: template.rendered,
        },
      }),
    })
  })

  return templates
}
