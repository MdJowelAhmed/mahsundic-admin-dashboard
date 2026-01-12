import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { SearchInput } from '@/components/common/SearchInput'
import { Pagination } from '@/components/common/Pagination'
import { ClientFilterDropdown } from './components/ClientFilterDropdown'
import { ClientTable } from './components/ClientTable'
import { AddEditClientModal } from './components/AddEditClientModal'
import { ViewClientDetailsModal } from './components/ViewClientDetailsModal'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { setFilters, setPage, setLimit, setClientStatus } from '@/redux/slices/clientSlice'
import { useUrlString, useUrlNumber } from '@/hooks/useUrlState'
import { toast } from '@/utils/toast'
import type { Client, ClientStatus } from '@/types'

export default function ClientManagement() {
  const dispatch = useAppDispatch()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  // Confirmation dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'toggle' | 'approve' | 'reject'
    client: Client
  } | null>(null)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false)

  // URL state management
  const [searchQuery, setSearchQuery] = useUrlString('search', '')
  const [statusFilter, setStatusFilter] = useUrlString('status', 'all')
  const [currentPage, setCurrentPage] = useUrlNumber('page', 1)
  const [itemsPerPage, setItemsPerPage] = useUrlNumber('limit', 10)

  // Redux state
  const { filteredList, pagination } = useAppSelector(
    (state) => state.clients
  )

  // Sync URL state with Redux filters
  useEffect(() => {
    dispatch(
      setFilters({
        search: searchQuery,
        status: statusFilter as ClientStatus | 'all',
      })
    )
  }, [searchQuery, statusFilter, dispatch])

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
  const handleView = (client: Client) => {
    setSelectedClient(client)
    setIsViewModalOpen(true)
  }

  const handleToggleVerification = (client: Client) => {
    setConfirmAction({ type: 'toggle', client })
    setIsConfirmOpen(true)
  }

  const handleApproveRequest = (client: Client) => {
    setConfirmAction({ type: 'approve', client })
    setIsConfirmOpen(true)
  }

  const handleRejectRequest = (client: Client) => {
    setConfirmAction({ type: 'reject', client })
    setIsConfirmOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return

    setIsConfirmLoading(true)
    try {
      const { type, client } = confirmAction

      if (type === 'toggle') {
        const nextStatus: ClientStatus =
          client.status === 'verified' ? 'unverified' : 'verified'
        dispatch(setClientStatus({ id: client.id, status: nextStatus }))
        toast({
          title: 'Success',
          description: `${client.name} is now ${nextStatus}.`,
          variant: 'success',
        })
      } else if (type === 'approve') {
        dispatch(setClientStatus({ id: client.id, status: 'verified' }))
        toast({
          title: 'Success',
          description: `${client.name} has been verified successfully.`,
          variant: 'success',
        })
      } else if (type === 'reject') {
        dispatch(setClientStatus({ id: client.id, status: 'unverified' }))
        toast({
          title: 'Success',
          description: `${client.name}'s request has been rejected.`,
          variant: 'success',
        })
      }

      setIsConfirmOpen(false)
      setConfirmAction(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update client status. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsConfirmLoading(false)
    }
  }

  const getConfirmDialogConfig = () => {
    if (!confirmAction) return null

    const { type, client } = confirmAction

    if (type === 'toggle') {
      const nextStatus = client.status === 'verified' ? 'unverified' : 'verified'
      return {
        title: 'Change Status',
        description: `Are you sure you want to change ${client.name}'s status to ${nextStatus}?`,
        variant: 'warning' as const,
        confirmText: 'Change Status',
      }
    } else if (type === 'approve') {
      return {
        title: 'Approve Request',
        description: `Are you sure you want to approve and verify ${client.name}?`,
        variant: 'info' as const,
        confirmText: 'Approve',
      }
    } else if (type === 'reject') {
      return {
        title: 'Reject Request',
        description: `Are you sure you want to reject ${client.name}'s verification request?`,
        variant: 'danger' as const,
        confirmText: 'Reject',
      }
    }

    return null
  }

  const handleAddNew = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedClient(null)
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
            Clients
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
            <ClientFilterDropdown
              value={statusFilter as ClientStatus | 'all'}
              onChange={setStatusFilter}
            />

            {/* Add New Client Button */}
            <Button
              onClick={handleAddNew}
              className="bg-primary-foreground hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <ClientTable
            clients={paginatedData}
            onView={handleView}
            onToggleStatus={handleToggleVerification}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
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

      {/* Add/Edit Client Modal */}
      <AddEditClientModal
        open={isModalOpen}
        onClose={handleCloseModal}
        client={selectedClient}
      />

      {/* View Client Details Modal */}
      <ViewClientDetailsModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
      />

      {/* Confirmation Dialog */}
      {confirmAction && getConfirmDialogConfig() && (
        <ConfirmDialog
          open={isConfirmOpen}
          onClose={() => {
            setIsConfirmOpen(false)
            setConfirmAction(null)
          }}
          onConfirm={handleConfirmAction}
          title={getConfirmDialogConfig()!.title}
          description={getConfirmDialogConfig()!.description}
          variant={getConfirmDialogConfig()!.variant}
          confirmText={getConfirmDialogConfig()!.confirmText}
          isLoading={isConfirmLoading}
        />
      )}
    </motion.div>
  )
}
