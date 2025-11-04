"use client"

import axios, { type AxiosInstance } from "axios"
import { useState } from "react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

let apiInstance: AxiosInstance | null = null

function getApiInstance() {
  if (!apiInstance) {
    apiInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    })

    apiInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
  }

  return apiInstance
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const api = getApiInstance()

  const get = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get<T>(url)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const post = async (url: string, payload: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<T>(url, payload)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const put = async (url: string, payload: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put<T>(url, payload)
      setData(response.data)
      return response.data
    } catch (err: any) {
      const message = err.response?.data?.message || "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const remove = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(url)
      return true
    } catch (err: any) {
      const message = err.response?.data?.message || "An error occurred"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, get, post, put, remove }
}
