import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import FollowUpModal from './FollowUpModal';
import './FollowUps.scss';

const FollowUps = () => {
  const [followUps, setFollowUps] = useState([
    {
      id: 1,
      title: 'Make sure we have a process in place to check that source once a month',
      description: '',
      priority: 'Medium',
      assignee: 'Bibek Paudyal',
      dueDate: '2024-09-30',
    },
    {
      id: 2,
      title: 'Make sure we have a source of truth of all certificates and their expiration dates',
      description: '',
      priority: 'Medium',
      assignee: 'Bibek Paudyal',
      dueDate: '2024-10-15',
    },
    {
      id: 3,
      title: 'Investigate root cause of database failure',
      description: '',
      priority: 'High',
      assignee: 'Bibek Paudyal',
      dueDate: '2024-09-25',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentFollowUp, setCurrentFollowUp] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Define columns for the table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Follow-up',
        sortable: true, // Indicating this column can be sorted
      },
      {
        accessorKey: 'dueDate',
        header: 'Due Date',
        cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        sortable: true,
      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        sortable: true,
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
        cell: ({ row }) => (
          <div className="assignee-info">
            <div className="assignee-icon">BP</div>
            {row.original.assignee}
          </div>
        ),
        sortable: false, // Not sortable
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="actions-cell">
            <button
              className="three-dot-menu"
              onClick={() => toggleDropdown(row.original.id)}
            >
              ⋮
            </button>
            {dropdownVisible === row.original.id && (
              <div className="dropdown-menu">
                <button onClick={() => handleEditFollowUp(row.original)}>
                  <span role="img" aria-label="edit">✏️</span> Edit
                </button>
                <button onClick={() => handleDeleteFollowUp(row.original.id)}>
                  <span role="img" aria-label="delete">🗑️</span> Delete
                </button>
              </div>
            )}
          </div>
        ),
        sortable: false, // No sorting for actions
      },
    ],
    [dropdownVisible]
  );

  const data = useMemo(() => followUps, [followUps]);

  // Create the table instance using TanStack Table v8
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
  });

  const handleCreateFollowUp = () => {
    setModalMode('create');
    setCurrentFollowUp(null);
    setIsModalOpen(true);
  };

  const handleEditFollowUp = (followUp) => {
    setModalMode('edit');
    setCurrentFollowUp(followUp);
    setIsModalOpen(true);
  };

  const handleSaveFollowUp = (newFollowUp) => {
    if (modalMode === 'create') {
      setFollowUps([...followUps, { ...newFollowUp, id: followUps.length + 1 }]);
    } else if (modalMode === 'edit') {
      setFollowUps(
        followUps.map((followUp) =>
          followUp.id === currentFollowUp.id ? { ...followUp, ...newFollowUp } : followUp
        )
      );
    }
    setIsModalOpen(false); // Close modal after saving
  };

  const handleDeleteFollowUp = (id) => {
    setFollowUps(followUps.filter((followUp) => followUp.id !== id));
  };

  // Toggle the visibility of the dropdown menu for the specific follow-up
  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  return (
    <div className="follow-ups-container">
      <div className="follow-ups-header">
        <div className="sort-by">
          <label htmlFor="sort-follow-ups">Sort by:</label>
        </div>

        <button className="new-follow-up-button" onClick={handleCreateFollowUp}>
          + New Follow-up
        </button>
      </div>

      <table className="follow-up-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {/* Sorting toggle */}
                  <div
                    className={
                      header.column.getCanSort() ? 'sortable-header' : undefined
                    }
                    onClick={header.column.getToggleSortingHandler()} // TanStack v8 way of handling sorting
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span>
                        {header.column.getIsSorted()
                          ? header.column.getIsSorted() === 'desc'
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>{' '}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      {/* Follow-up Modal for Create and Edit */}
      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFollowUp}
        initialData={currentFollowUp}
        mode={modalMode}
      />
    </div>
  );
};

export default FollowUps;
