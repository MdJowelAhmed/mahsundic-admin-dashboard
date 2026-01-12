import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { CarFilterDropdown } from './components/CarFilterDropdown'
import { CarTable } from './components/CarTable'
import { AddEditCarModal } from './components/AddEditCarModal'
import { ViewCarDetailsModal } from './components/ViewCarDetailsModal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  setFilters,
  setPage,
  setLimit,
  deleteCar,
} from '@/redux/slices/carSlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { Car, CarClass } from '@/types'

export default function CarList() {
  const dispatch = useAppDispatch()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [carToDelete, setCarToDelete] = useState<Car | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // URL state management
  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [carClassFilter, setCarClassFilter] = useUrlString('carClass', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  // Redux state
  const { filteredList, pagination } = useAppSelector(
    (state) => state.cars
  )

  // Sync URL state with Redux filters
  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        carClass: carClassFilter as CarClass | 'all',
      })
    )
  }, [searchQuery, carClassFilter, dispatch])

  // Sync URL pagination with Redux
  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  // Pagination
  const totalPages = pagination.totalPages
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

  // Handlers
  const handleEdit = (car: Car) => {
    setSelectedCar(car)
    setIsModalOpen(true)
  }

  const handleView = (car: Car) => {
    setSelectedCar(car)
    setIsViewModalOpen(true)
  }

  const handleDelete = (car: Car) => {
    setCarToDelete(car)
    setIsConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!carToDelete) return

    setIsDeleting(true)
    try {
      // Simulate API call delay if needed
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      dispatch(deleteCar(carToDelete.id))
      toast({
        variant: 'success',
        title: 'Car Deleted',
        description: `${carToDelete.name} has been deleted successfully.`,
      })
      
      setIsConfirmOpen(false)
      setCarToDelete(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete car. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddNew = () => {
    setSelectedCar(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCar(null)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (limit: number) => {
    setItemsPerPage(limit)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <Card className="bg-white border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-6">
          <CardTitle className="text-xl font-bold text-slate-800">
            Car List
          </CardTitle>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search Car name & Transmission"
              className="w-[300px]"
            />

            {/* Filter Dropdown */}
            <CarFilterDropdown
              value={carClassFilter as CarClass | 'all'}
              onChange={setCarClassFilter}
            />

            {/* Add New Car Button */}
            <Button
              onClick={handleAddNew}
              className="bg-primary-foreground hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Car
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <CarTable
            cars={paginatedData}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100">
            <Pagination
              currentPage={pagination.page}
              totalPages={totalPages}
              totalItems={filteredList.length}
              itemsPerPage={pagination.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Car Modal */}
      <AddEditCarModal
        open={isModalOpen}
        onClose={handleCloseModal}
        car={selectedCar}
      />

      {/* View Car Details Modal */}
      <ViewCarDetailsModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedCar(null)
        }}
        car={selectedCar}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false)
          setCarToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Car"
        description={`Are you sure you want to delete "${carToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Car"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}
