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
import TaskModal from './TaskModal';
import noTasksImage from './action_items-83faa0083fd70c36e165471d68f6b34276b28d56706b19ba1e9279057a14b367.svg';
import { fetchTasks, addTask, deleteTask, updateTask } from '../../../../../redux/reducer/taskSlice';
import './Tasks.scss';
import { FaTrashAlt } from 'react-icons/fa'; // For delete icon
import { FaRegCircle, FaRegCheckCircle, FaRegDotCircle } from 'react-icons/fa'; // For status icons
import { useAuthFetch } from '../../../../../hooks/useAuthFetch';
import { REACT_APP_API_SERVER_URL } from '../../../../../config/constant';

const Tasks = ({ incidentId }) => {
  const { tasks, loading } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState([]); // Track expanded task descriptions
  const [editingField, setEditingField] = useState(null);  // Track the field currently being edited
  const [editingValues, setEditingValues] = useState({});  // Track the editing values
  const [sorting, setSorting] = useState([{ id: 'priority', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

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
    dispatch(fetchTasks(incidentId));
  }, [dispatch, incidentId]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      dispatch(updateTask({ taskId: editingTask.id, taskData }));
    } else {
      dispatch(addTask({ incidentId, newTask: taskData }));
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteTask = () => {
    dispatch(deleteTask(taskToDelete));
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const cancelDeleteTask = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const startEditingField = (taskId, field) => {
    setEditingField({ taskId, field });
    setEditingValues({ [field]: tasks.find((task) => task.id === taskId)[field] });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setEditingValues({});
  };

  const handleFieldChange = (field, value) => {
    setEditingValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveInlineEdit = (taskId) => {
    dispatch(updateTask({ taskId, taskData: editingValues }));
    setEditingField(null);  // Exit editing mode
    setEditingValues({});   // Reset the editing values
  };

  const updateTaskField = (taskId, field, value) => {
    const taskData = { [field]: value };
    dispatch(updateTask({ taskId, taskData }));
  };

  const handleShowMore = (taskId) => {
    setExpandedTasks((prev) => [...prev, taskId]);
  };

  const handleShowLess = (taskId) => {
    setExpandedTasks((prev) => prev.filter((id) => id !== taskId));
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
    data: tasks,
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
    <div className="tasks-container">
      <div className="tasks-header">
        {/* Updated sorting controls */}
          <div className="sort-by">
            <label htmlFor="sort-tasks">Sort by:</label>
            <select
              id="sort-tasks"
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

        <Button className="new-task-button" onClick={handleCreateTask}>
          + New Task
        </Button>
        
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : tasks.length === 0 ? (
        <div className="no-tasks-placeholder">
          <img src={noTasksImage} alt="No Tasks" className="placeholder-image" />
          <p className="no-tasks-message">
            It looks like there are no tasks for this Incident yet.
          </p>
          <button className="create-task-link" onClick={handleCreateTask}>
            + Create Task
          </button>
        </div>
      ) : (
        <>
          <div className="task-cards">
            {table.getRowModel().rows.map((row) => {
              const task = row.original;
              return (
                <div key={task.id} className="task-card">
                  <div className="task-content">
                    {/* Task Title */}
                    <div className="task-details">
                      {editingField?.taskId === task.id && editingField.field === 'title' ? (
                        <div className="inline-editor">
                          <input
                            type="text"
                            className="inline-input"
                            value={editingValues.title || task.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                          />
                          <button
                            className="inline-edit-save-button"
                            onClick={() => saveInlineEdit(task.id)}
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
                        <h3 className="task-title" onClick={() => startEditingField(task.id, 'title')}>
                          {task.title}
                        </h3>
                      )}

                      {/* Task Description */}
                      {editingField?.taskId === task.id && editingField.field === 'description' ? (
                        <div className="inline-editor">
                          <textarea
                            className="inline-textarea"
                            value={editingValues.description || task.description}
                            onChange={(e) => handleFieldChange('description', e.target.value)}
                          />
                          <button
                            className="inline-edit-save-button"
                            onClick={() => saveInlineEdit(task.id)}
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
                          <p className="task-description" onClick={() => startEditingField(task.id, 'description')}>
                            {expandedTasks.includes(task.id)
                              ? task.description
                              : task.description.length > 100
                              ? `${task.description.substring(0, 100)}...`
                              : task.description}
                          </p>
                          {/* Show More/Show Less button outside of the description */}
                          {task.description.length > 100 && (
                            <span className="show-more" onClick={() => expandedTasks.includes(task.id) ? handleShowLess(task.id) : handleShowMore(task.id)}>
                              {expandedTasks.includes(task.id) ? 'Show Less' : 'Show More'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Editable Fields (Priority, Assignee, Status, Due Date) */}
                    <div className="task-editable">
                      <div className="task-pill">
                        <label>Priority:</label>
                        <select
                          value={task.priority}
                          onChange={(e) => updateTaskField(task.id, 'priority', e.target.value)}
                        >
                          {priorityOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="task-pill">
                        <label>Assignee:</label>
                        <select
                          value={task.assignee ? task.assignee._id : ''}
                          onChange={(e) =>
                            updateTaskField(task.id, 'assignee_id', e.target.value)
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

                      <div className="task-pill">
                        <label>Status:</label>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskField(task.id, 'status', e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Due Date */}
                      <div className="task-pill">
                        <label>Due Date:</label>
                        <input
                          type="date"
                          value={task.due_date}
                          onChange={(e) => updateTaskField(task.id, 'due_date', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Delete Icon */}
                    <div className="delete-task" onClick={() => handleDeleteTask(task.id)}>
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

      {/* Task Modal for Create/Edit */}
      <TaskModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveTask} task={editingTask} />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={cancelDeleteTask}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDeleteTask}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTask}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Tasks;
