import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { Spinner, Modal, Button } from 'react-bootstrap';
import FollowUpModal from './FollowUpModal';
import noFollowUpsImage from './action_items-83faa0083fd70c36e165471d68f6b34276b28d56706b19ba1e9279057a14b367.svg';
import { fetchFollowUps, addFollowUp, deleteFollowUp, updateFollowUp } from '../../../../../redux/reducer/followUpSlice';
import './FollowUps.scss';
import { FaTrashAlt } from 'react-icons/fa'; // For delete icon
import { FaRegCircle, FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa'; // For status icons
import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';

const FollowUps = ({ incidentId }) => {
  const { followUps, loading } = useSelector((state) => state.followUps);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState(null);
  const [expandedFollowUps, setExpandedFollowUps] = useState([]); // Track expanded followUp descriptions
  const [editingField, setEditingField] = useState(null);  // Track the field currently being edited
  const [editingValues, setEditingValues] = useState({});  // Track the editing values
  const [sorting, setSorting] = useState([{ id: 'priority', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [followUpToDelete, setFollowUpToDelete] = useState(null);

  const authFetch = useAuthFetch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authFetch(`${REACT_APP_API_SERVER_URL}/api/users/`);
        setUsers(response);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    dispatch(fetchFollowUps(incidentId));
  }, [dispatch, incidentId]);

  const handleCreateFollowUp = () => {
    setEditingFollowUp(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFollowUp(null);
  };

  const handleSaveFollowUp = (followUpData) => {
    if (editingFollowUp) {
      dispatch(updateFollowUp({ followUpId: editingFollowUp.id, followUpData }));
    } else {
      dispatch(addFollowUp({ incidentId, newFollowUp: followUpData }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteFollowUp = (followUpId) => {
    setFollowUpToDelete(followUpId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteFollowUp = () => {
    dispatch(deleteFollowUp(followUpToDelete));
    setShowDeleteConfirm(false);
    setFollowUpToDelete(null);
  };

  const cancelDeleteFollowUp = () => {
    setShowDeleteConfirm(false);
    setFollowUpToDelete(null);
  };

  const startEditingField = (followUpId, field) => {
    setEditingField({ followUpId, field });
    setEditingValues({ [field]: followUps.find((followUp) => followUp.id === followUpId)[field] });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditingValues({});
  };

  const handleFieldChange = (field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveInlineEdit = (followUpId) => {
    dispatch(updateFollowUp({ followUpId, followUpData: editingValues }));
    setEditingField(null);  // Exit editing mode
    setEditingValues({});   // Reset the editing values
  };

  const updateFollowUpField = (followUpId, field, value) => {
    const followUpData = { [field]: value };
    dispatch(updateFollowUp({ followUpId, followUpData }));
  };

  const handleShowMore = (followUpId) => {
    setExpandedFollowUps((prev) => [...prev, followUpId]);
  };

  const handleShowLess = (followUpId) => {
    setExpandedFollowUps((prev) => prev.filter((id) => id !== followUpId));
  };

  // Define a custom priority sorting function
  const customPrioritySort = (rowA, rowB, columnId) => {
    const priorityOrder = { Low: 1, Medium: 2, High: 3 };
    const aPriority = rowA.getValue(columnId);
    const bPriority = rowB.getValue(columnId);
    return priorityOrder[aPriority] - priorityOrder[bPriority];
  };
// Define column structure to enable sorting
const columnHelper = createColumnHelper();
const columns = useMemo(
  () => [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => info.getValue(),
      sortingFn: 'customPrioritySort', // Use the name of the custom sorting function
    }),
    columnHelper.accessor('due_date', {
      header: 'Due Date',
      cell: (info) => info.getValue(),
    }),
  ],
  [] // Empty dependency array to prevent unnecessary re-renders
);

  const table = useReactTable({
    data: followUps,
    columns: columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    sortingFns: {
      customPrioritySort,
    },
  });

  const statusOptions = [
    { value: 'Todo', label: 'Todo', icon: <FaRegCircle /> },
    { value: 'In Progress', label: 'In Progress', icon: <FaRegDotCircle /> },
    { value: 'Done', label: 'Done', icon: <FaRegCheckCircle /> },
  ];

  const priorityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  // Function to toggle the sort order and reapply the sort immediately
  const toggleSortOrder = () => {
    setSorting((prev) => [
      {
        id: prev[0]?.id || 'priority',
        desc: !prev[0]?.desc,
      },
    ]);
  };

  return (
    <div className="followups-container">
      <div className="followups-header">
        {/* Updated sorting controls */}
          <div className="sort-by">
            <label htmlFor="sort-followUps">Sort by:</label>
            <select
              id="sort-followUps"
              className="sort-dropdown"
              value={sorting[0]?.id || 'priority'}
              onChange={(e) => {
                const newField = e.target.value;
                setSorting([{ id: newField, desc: sorting[0]?.desc || false }]);
              }}
            >
              <option value="title">Title</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
            </select>
            <Button className="sort-order-button" onClick={toggleSortOrder}>
              {sorting[0]?.desc ? 'Desc' : 'Asc'}
            </Button>
          </div>

        <Button className="new-followup-button" onClick={handleCreateFollowUp}>
          + New Follow-up
        </Button>
        
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : followUps.length === 0 ? (
        <div className="no-followups-placeholder">
          <img src={noFollowUpsImage} alt="No FollowUps" className="placeholder-image" />
          <p className="no-followups-message">
            It looks like there are no followUps for this Incident yet.
          </p>
          <button className="create-followup-link" onClick={handleCreateFollowUp}>
            + Create Follow-up
          </button>
        </div>
      ) : (
        <>
          <div className="followup-cards">
            {table.getRowModel().rows.map((row) => {
              const followUp = row.original;
              return (
                <div key={followUp.id} className="followup-card">
                  <div className="followup-content">
                    {/* Follow-up Title */}
                    <div className="followup-details">
                      {editingField?.followUpId === followUp.id && editingField.field === 'title' ? (
                        <div className="inline-editor">
                          <input
                            type="text"
                            className="inline-input"
                            value={editingValues.title || followUp.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                          />
                          <button
                            className="inline-edit-save-button"
                            onClick={() => saveInlineEdit(followUp.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="inline-edit-cancel-button"
                            onClick={cancelEditing}
                          >
                             ✗
                          </button>
                        </div>
                      ) : (
                        <h3 className="followup-title" onClick={() => startEditingField(followUp.id, 'title')}>
                          {followUp.title}
                        </h3>
                      )}

                      {/* Follow-up Description */}
                      {editingField?.followUpId === followUp.id && editingField.field === 'description' ? (
                        <div className="inline-editor">
                          <textarea
                            className="inline-textarea"
                            value={editingValues.description || followUp.description}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                          />
                          <button
                            className="inline-edit-save-button"
                            onClick={() => saveInlineEdit(followUp.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="inline-edit-cancel-button"
                            onClick={cancelEditing}
                          >
                            ✗
                          </button>
                        </div>
                      ) : (
                        <div>
                          {/* Description text that triggers inline editing */}
                          <p className="followup-description" onClick={() => startEditingField(followUp.id, 'description')}>
                            {expandedFollowUps.includes(followUp.id)
                              ? followUp.description
                              : followUp.description.length > 100
                              ? `${followUp.description.substring(0, 100)}...`
                              : followUp.description}
                          </p>
                          {/* Show More/Show Less button outside of the description */}
                          {followUp.description.length > 100 && (
                            <span className="show-more" onClick={() => expandedFollowUps.includes(followUp.id) ? handleShowLess(followUp.id) : handleShowMore(followUp.id)}>
                              {expandedFollowUps.includes(followUp.id) ? 'Show Less' : 'Show More'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Editable Fields (Priority, Assignee, Status, Due Date) */}
                    <div className="followup-editable">
                      <div className="followup-pill">
                        <label>Priority:</label>
                        <select
                          value={followUp.priority}
                          onChange={(e) => updateFollowUpField(followUp.id, 'priority', e.target.value)}
                        >
                          {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="followup-pill">
                        <label>Assignee:</label>
                        <select
                          value={followUp.assignee ? followUp.assignee._id : ''}
                          onChange={(e) =>
                            updateFollowUpField(followUp.id, 'assignee_id', e.target.value)
                          }
                        >
                          <option value="">Unassigned</option>
                          {users.map((user) => (
                            <option key={user._id} value={user._id}>
                              {user.name || user.email}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="followup-pill">
                        <label>Status:</label>
                        <select
                          value={followUp.status}
                          onChange={(e) => updateFollowUpField(followUp.id, 'status', e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Due Date */}
                      <div className="followup-pill">
                        <label>Due Date:</label>
                        <input
                          type="date"
                          value={followUp.due_date}
                          onChange={(e) => updateFollowUpField(followUp.id, 'due_date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Delete Icon */}
                    <div className="delete-followUp" onClick={() => handleDeleteFollowUp(followUp.id)}>
                      <FaTrashAlt />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              {'<<'}
            </button>{' '}
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              {'<'}
            </button>{' '}
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              {'>'}
            </button>{' '}
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>{' '}
            </span>
          </div>
        </>
      )}

      {/* Follow-up Modal for Create/Edit */}
      <FollowUpModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveFollowUp} followUp={editingFollowUp} />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={cancelDeleteFollowUp}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this followUp?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteFollowUp}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteFollowUp}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FollowUps;
