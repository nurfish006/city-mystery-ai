import { v4 as uuidv4 } from "uuid"

const CHAPA_API_KEY = process.env.CHAPA_SECRET_KEY
const CHAPA_API_URL = "https://api.chapa.co/v1"

export interface ChapaInitializeResponse {
  message: string
  status: string
  data: {
    checkout_url: string
  }
}

export interface ChapaVerifyResponse {
  message: string
  status: string
  data: {
    first_name: string
    last_name: string
    email: string
    currency: string
    amount: number
    charge: number
    mode: string
    method: string
    type: string
    status: string
    reference: string
    tx_ref: string
    customization: {
      title: string
      description: string
      logo: string
    }
    meta: any
    created_at: string
    updated_at: string
  }
}

export const chapa = {
  initialize: async (data: {
    amount: string
    currency: string
    email: string
    first_name: string
    last_name: string
    tx_ref?: string
    callback_url?: string
    return_url?: string
    customization?: {
      title?: string
      description?: string
    }
  }): Promise<ChapaInitializeResponse> => {
    if (!CHAPA_API_KEY) {
      throw new Error("CHAPA_SECRET_KEY is not defined")
    }

    const tx_ref = data.tx_ref || `tx-${uuidv4()}`

    const response = await fetch(`${CHAPA_API_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHAPA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        tx_ref,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to initialize transaction")
    }

    return response.json()
  },

  verify: async (tx_ref: string): Promise<ChapaVerifyResponse> => {
    if (!CHAPA_API_KEY) {
      throw new Error("CHAPA_SECRET_KEY is not defined")
    }

    const response = await fetch(`${CHAPA_API_URL}/transaction/verify/${tx_ref}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CHAPA_API_KEY}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to verify transaction")
    }

    return response.json()
  },
}
