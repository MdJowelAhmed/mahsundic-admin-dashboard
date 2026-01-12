import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, deleteAgency } from '@/redux/slices/agencySlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/utils/toast'
import type { Agency, AgencyStatus } from '@/types'
import { AgencyTable } from './components/AgencyTable'
import { AddEditAgencyModal } from './components/AddEditAgencyModal'
import { ViewAgencyDetailsModal } from './components/ViewAgencyDetailsModal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'

export default function AgencyManagement() {
  const dispatch = useAppDispatch()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null)
  const [agencyToDelete, setAgencyToDelete] = useState<Agency | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [statusFilter, setStatusFilter] = useUrlString('status', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  const { filteredList, pagination } = useAppSelector((state) => state.agencies)

  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        status: statusFilter as AgencyStatus | 'all',
      })
    )
  }, [searchQuery, statusFilter, dispatch])

  useEffect(() => {
    dispatch(setPage(currentPage))
  }, [currentPage, dispatch])

  useEffect(() => {
    dispatch(setLimit(itemsPerPage))
  }, [itemsPerPage, dispatch])

  const totalPages = pagination.totalPages
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit
    return filteredList.slice(startIndex, startIndex + pagination.limit)
  }, [filteredList, pagination.page, pagination.limit])

  const handleView = (agency: Agency) => {
    setSelectedAgency(agency)
    setIsViewModalOpen(true)
  }

  const handleDelete = (agency: Agency) => {
    setAgencyToDelete(agency)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!agencyToDelete) return

    try {
      setIsDeleting(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      dispatch(deleteAgency(agencyToDelete.id))
      toast({
        title: 'Agency Deleted',
        description: `${agencyToDelete.name} has been removed.`,
      })
      setIsDeleteDialogOpen(false)
      setAgencyToDelete(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete agency. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddNew = () => {
    setSelectedAgency(null)
    setIsEditModalOpen(true)
  }

  const handleEdit = (agency: Agency) => {
    setSelectedAgency(agency)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedAgency(null)
  }

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false)
    setSelectedAgency(null)
  }

  const handleCloseDeleteDialog = () => {
    if (!isDeleting) {
      setIsDeleteDialogOpen(false)
      setAgencyToDelete(null)
    }
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
            Agencies
          </CardTitle>
          <div className="flex items-center gap-3">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search Agency, Owner, Email or Country"
              className="w-[300px]"
            />

            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger className="w-[140px] h-[44px] bg-secondary text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddNew}
              className="bg-primary-foreground hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Agency
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <AgencyTable
            agencies={paginatedData}
            onView={handleView}
            onEdit={(agency) => {
              handleEdit(agency)
            }}
            onDelete={handleDelete}
          />

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

      {/* Edit/Add Modal */}
      <AddEditAgencyModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        agency={selectedAgency}
      />

      {/* View Details Modal */}
      <ViewAgencyDetailsModal
        open={isViewModalOpen}
        onClose={handleCloseViewModal}
        agency={selectedAgency}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Agency"
        description={`Are you sure you want to delete "${agencyToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </motion.div>
  )
}