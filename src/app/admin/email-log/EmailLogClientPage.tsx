"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { EmailStatus, EmailLog } from "@prisma/client";
import { FaTrash } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import ConfirmationModal from "@/components/ConfirmationModal";

interface EmailLogApiResponse {
  logs: EmailLog[];
  totalLogsCount: number;
  currentPage: number;
  pageSize: number;
}

interface EmailLogClientPageProps {
  initialLogs: EmailLog[];
  totalLogsCount: number;
  currentPage: number;
  pageSize: number;
}

const statusColors: Record<EmailStatus, string> = {
  PENDING: "text-yellow-600",
  SENT: "text-green-600",
  FAILED: "text-red-600",
};

export default function EmailLogClientPage({
  initialLogs,
  totalLogsCount: initialTotalLogsCount,
  currentPage: initialCurrentPage,
  pageSize: initialPageSize,
}: EmailLogClientPageProps) {
  const [logs, setLogs] = useState<EmailLog[]>(initialLogs);
  const [totalLogsCount, setTotalLogsCount] = useState<number>(initialTotalLogsCount);
  const [currentPage, setCurrentPage] = useState<number>(initialCurrentPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialPageSize);

  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterTo, setFilterTo] = useState<string>("");
  const [filterOrderId, setFilterOrderId] = useState<string>("");

  const [selectedLogIds, setSelectedLogIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logsToDelete, setLogsToDelete] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageMessage, setPageMessage] = useState<{ text: string, type: 'info' | 'error' | 'success' } | null>(null);

  const totalPages = useMemo(() => Math.ceil(totalLogsCount / itemsPerPage), [totalLogsCount, itemsPerPage]);

  useEffect(() => {
    setLogs(initialLogs);
    setTotalLogsCount(initialTotalLogsCount);
    setCurrentPage(initialCurrentPage);
    setItemsPerPage(initialPageSize);
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [initialLogs, initialTotalLogsCount, initialCurrentPage, initialPageSize]);

  const fetchLogs = useCallback(async () => {
    setIsRefreshing(true);
    setPageMessage(null);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filterStatus && filterStatus !== "ALL") params.append("status", filterStatus);
      if (filterTo) params.append("to", filterTo);
      if (filterOrderId) params.append("orderId", filterOrderId);
      params.append("page", currentPage.toString());
      params.append("pageSize", itemsPerPage.toString());

      const url = `/api/admin/email-log${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch email logs.");
      }
      const data: EmailLogApiResponse = await response.json();

      setLogs(data.logs);
      setTotalLogsCount(data.totalLogsCount);
      setCurrentPage(data.currentPage);
      setItemsPerPage(data.pageSize);
      setLastUpdated(new Date());

      setSelectedLogIds(prev =>
        prev.filter(id => data.logs.some(log => log.id === id))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setPageMessage({ text: `Failed to load email logs: ${err instanceof Error ? err.message : String(err)}`, type: 'error' });
    } finally {
      setIsRefreshing(false);
    }
  }, [filterStatus, filterTo, filterOrderId, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!isLoading) {
      fetchLogs();
    }
  }, [currentPage, itemsPerPage, fetchLogs, isLoading, filterStatus, filterTo, filterOrderId]);

  useEffect(() => {
    const intervalId = setInterval(fetchLogs, 30000);
    return () => clearInterval(intervalId);
  }, [fetchLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const handleToggleSelectLog = (id: string) => {
    setSelectedLogIds(prev =>
      prev.includes(id) ? prev.filter(logId => logId !== id) : [...prev, id]
    );
  };

  const handleSelectAllLogs = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLogIds(logs.map(log => log.id));
    } else {
      setSelectedLogIds([]);
    }
  };

  const triggerDelete = (ids: string | string[]) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids];
    setLogsToDelete(idsToDelete);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (logsToDelete.length === 0) return;
    setIsDeleting(true);
    setIsDeleteModalOpen(false);
    setPageMessage(null);

    try {
      const params = new URLSearchParams();
      logsToDelete.forEach(id => params.append("id", id));
      const res = await fetch(`/api/admin/email-log?${params.toString()}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete log(s)");
      }

      fetchLogs();
      setPageMessage({ text: `Successfully deleted ${logsToDelete.length} log(s)!`, type: 'success' });
      setSelectedLogIds([]);
    } catch (err: unknown) {
      setPageMessage({ text: `Error deleting log(s): ${err instanceof Error ? err.message : String(err)}`, type: 'error' });
    } finally {
      setIsDeleting(false);
      setLogsToDelete([]);
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLogsToDelete([]);
  };

  const handleChangeStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/email-log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status");
      }
      setPageMessage({ text: "Status updated successfully.", type: "success" });
      fetchLogs();
    } catch (err: unknown) {
      setPageMessage({ text: `Error updating status: ${err instanceof Error ? err.message : String(err)}`, type: 'error' });
    }
  };

  if (error) return <p className="text-center text-red-500 p-8">Error: {error}</p>;
  if (isLoading) return (
    <div className="container mx-auto px-4 sm:px-6 xl:px-8 py-6 flex justify-center items-center min-h-[60vh]">
      <LoadingSpinner text="Loading email logs..." />
    </div>
  );

  const isAllSelected = logs.length > 0 && selectedLogIds.length === logs.length;

  const pageNumbers: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 xl:px-8 py-6">
      {pageMessage && (
        <div className={`relative px-4 py-3 rounded-lg shadow-md mb-4 text-center ${pageMessage.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
          pageMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
          <p>{pageMessage.text}</p>
          <button
            onClick={() => setPageMessage(null)}
            className="absolute top-1 right-2 text-current text-lg opacity-75 hover:opacity-100"
          >&times;</button>
        </div>
      )}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Email Logs</h1>
        <div className="text-sm text-gray-500 text-right mt-2 md:mt-0">
          {isRefreshing ? (
            <span>Refreshing...</span>
          ) : (
            lastUpdated && (
              <span>
                Last updated: {format(lastUpdated, 'HH:mm:ss')} WITA
              </span>
            )
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              id="statusFilter"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All</option>
              {Object.keys(EmailStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="toFilter" className="block text-sm font-medium text-gray-700 mb-1">To (Email)</label>
            <input
              type="text"
              id="toFilter"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
              value={filterTo}
              onChange={e => setFilterTo(e.target.value)}
              placeholder="Search email"
            />
          </div>
          <div>
            <label htmlFor="orderIdFilter" className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
            <input
              type="text"
              id="orderIdFilter"
              className="w-full border-gray-300 rounded-md shadow-sm text-sm px-3 py-2 focus:ring-primary focus:border-primary"
              value={filterOrderId}
              onChange={e => setFilterOrderId(e.target.value)}
              placeholder="Search order ID"
            />
          </div>
          <button
            onClick={() => triggerDelete(selectedLogIds)}
            className="w-full md:w-auto px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-md shadow-sm hover:bg-red-700 transition-opacity mt-4 md:mt-0 flex items-center justify-center space-x-1 disabled:opacity-50"
            disabled={selectedLogIds.length === 0 || isDeleting}
            title="Delete selected logs"
            type="button"
          >
            <FaTrash className="text-base" /> <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full text-left">
          <thead className="border-b bg-stone-50">
            <tr>
              <th className="px-4 py-3 align-middle">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAllLogs}
                  aria-label="Select all logs"
                  className="form-checkbox h-4 w-4 text-primary rounded"
                />
              </th>
              <th className="px-4 py-3 align-middle font-semibold">To</th>
              <th className="px-4 py-3 align-middle font-semibold">Subject</th>
              <th className="px-4 py-3 align-middle font-semibold">Order</th>
              <th className="px-4 py-3 align-middle font-semibold">Status</th>
              <th className="px-4 py-3 align-middle font-semibold text-center">Retries</th>
              <th className="px-4 py-3 align-middle font-semibold">Error</th>
              <th className="px-4 py-3 align-middle font-semibold">Created</th>
              <th className="px-4 py-3 align-middle font-semibold">Updated</th>
              <th className="px-4 py-3 align-middle font-semibold w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-6 text-center text-gray-500 align-middle">No email logs found.</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b hover:bg-stone-50">
                  <td className="px-4 py-3 align-middle">
                    <input
                      type="checkbox"
                      checked={selectedLogIds.includes(log.id)}
                      onChange={() => handleToggleSelectLog(log.id)}
                      aria-label={`Select log ${log.id}`}
                      className="form-checkbox h-4 w-4 text-primary rounded"
                    />
                  </td>
                  <td className="px-4 py-3 align-middle">{log.to}</td>
                  <td className="px-4 py-3 align-middle">{log.subject}</td>
                  <td className="px-4 py-3 align-middle">
                    {log.orderId ? (
                      <Link href={`/admin/orders/${log.orderId}`} className="text-blue-600 underline">
                        {log.orderId.slice(-8)}
                      </Link>
                    ) : '-'}
                  </td>
                  <td className={`px-4 py-3 align-middle font-bold ${statusColors[log.status]}`}>
                    <select
                      value={log.status}
                      onChange={e => handleChangeStatus(log.id, e.target.value)}
                      disabled={log.status === "SENT"}
                      className="border rounded px-2 py-1"
                    >
                      {Object.keys(EmailStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 align-middle text-center">{log.retryCount}</td>
                  <td className="px-4 py-3 align-middle">{log.error || '-'}</td>
                  <td className="px-4 py-3 align-middle">{format(new Date(log.createdAt), 'dd MMM yyyy, HH:mm')}</td>
                  <td className="px-4 py-3 align-middle">{format(new Date(log.updatedAt), 'dd MMM yyyy, HH:mm')}</td>
                  <td className="px-4 py-3 align-middle text-center">
                    <button
                      onClick={() => triggerDelete(log.id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-50"
                      title="Delete log"
                      disabled={isDeleting}
                    >
                      <FaTrash className="text-base" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 p-4 bg-white rounded-xl shadow-md space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-700">Items per page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border-gray-300 rounded-md shadow-sm text-sm px-2 py-1 focus:ring-primary focus:border-primary"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isRefreshing}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              title="Previous Page"
            >
              &lt;
            </button>
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50`}
                disabled={isRefreshing}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isRefreshing}
              className="p-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              title="Next Page"
            >
              &gt;
            </button>
          </div>

          <div className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
        title={logsToDelete.length > 1 ? "Confirm Batch Deletion" : "Confirm Deletion"}
      >
        {logsToDelete.length === 1 ? (
          <p>
            Are you sure you want to delete this log?
          </p>
        ) : (
          <p>
            Are you sure you want to delete <strong className="font-mono">{logsToDelete.length} logs</strong>?
          </p>
        )}
        <p className="text-sm text-red-600 mt-2">This action cannot be undone.</p>
      </ConfirmationModal>
    </div>
  );
}