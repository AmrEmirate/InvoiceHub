"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect } from "react"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { useAuth } from "@/hooks/use-auth"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  sku: string
}

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Web Development",
      description: "Custom website development",
      price: 1500,
      category: "Services",
      sku: "WEB-001",
    },
    {
      id: "2",
      name: "UI/UX Design",
      description: "Professional design services",
      price: 800,
      category: "Services",
      sku: "DESIGN-001",
    },
    {
      id: "3",
      name: "Consulting",
      description: "Business consulting",
      price: 200,
      category: "Services",
      sku: "CONSULT-001",
    },
  ])

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Services",
    sku: "",
  })

  useEffect(() => {
    let filtered = products
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    if (categoryFilter !== "all") {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }
    setFilteredProducts(filtered)
  }, [searchTerm, categoryFilter, products])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set("search", value)
    } else {
      params.delete("search")
    }
    router.push(`?${params.toString()}`)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value)
    const params = new URLSearchParams(searchParams)
    if (value !== "all") {
      params.set("category", value)
    } else {
      params.delete("category")
    }
    router.push(`?${params.toString()}`)
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (newProduct.name && newProduct.sku && newProduct.price > 0) {
      const product: Product = {
        id: Date.now().toString(),
        ...newProduct,
      }
      setProducts([...products, product])
      setNewProduct({ name: "", description: "", price: 0, category: "Services", sku: "" })
      setShowAddForm(false)
      alert("Product added successfully!")
    }
  }

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setCategoryFilter("all")
    router.push("/products")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products & Services</h1>
            <p className="text-neutral-600">Manage your products and services</p>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            {showAddForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="card p-6 bg-green-50 border-green-200">
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="input-field"
                    placeholder="Product name"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">SKU *</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="input-field"
                    placeholder="Product SKU"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Price *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) })}
                    className="input-field"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input-field"
                  >
                    <option>Services</option>
                    <option>Products</option>
                    <option>Support</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label-text">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="input-field h-20 resize-none"
                    placeholder="Product description"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">
                Save Product
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-text">Search</label>
              <input
                type="text"
                placeholder="Product name or SKU..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="label-text">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Categories</option>
                <option value="Services">Services</option>
                <option value="Products">Products</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={handleReset} className="btn-secondary w-full">
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="card overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-neutral-600">{product.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-600">{product.sku}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-foreground">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="text-accent hover:text-accent-dark text-sm font-medium">Edit</button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-danger hover:text-red-700 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No products found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
