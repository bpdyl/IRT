import React, { useState } from 'react';
import './Timeline.scss';

const Timeline = () => {
  const eventsPerPage = 5;  // Number of events per page
  const [currentPage, setCurrentPage] = useState(1);
  const [allEvents, setAllEvents] = useState([
    {
      id: 1,
      author: 'Bibek Paudyal',
      timestamp: 'Sep 4 07:33:52 PM +0545',
      message: 'marked incident as',
      status: 'resolved',
      statusType: 'success',
      comments: [],
    },
    {
      id: 2,
      author: 'Bibek Paudyal',
      timestamp: 'Sep 4 07:33:52 PM +0545',
      message: 'marked incident as',
      status: 'mitigated',
      statusType: 'warning',
      comments: [],
    },
    {
      id: 3,
      author: 'Bibek Paudyal',
      timestamp: 'Sep 3 07:44:52 PM +0545',
      message: 'New certificate in place. www.domain is available through HTTPS again',
      comments: [],
    },
    {
      id: 4,
      author: 'Bibek Paudyal',
      timestamp: 'Sep 3 07:42:52 PM +0545',
      message: 'Certificate is being deployed',
      comments: [],
    },
  ]);

  const [newEvent, setNewEvent] = useState(''); // State for new event input
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [newComment, setNewComment] = useState('');
  const [visibleCommentEventId, setVisibleCommentEventId] = useState(null); // For toggling comment section visibility
  const [dropdownVisible, setDropdownVisible] = useState(null); // For showing/hiding three-dot dropdown

  // Add Event
  const handleAddEvent = () => {
    if (newEvent.trim()) {
      const newEntry = {
        id: allEvents.length + 1,
        author: 'You',
        timestamp: new Date().toLocaleString(),
        message: newEvent,
        status: '',
        comments: [],
      };
      setAllEvents([newEntry, ...allEvents]);
      setNewEvent(''); // Clear input field
    }
  };

  // Edit Event
  const handleEditEvent = (eventId, currentMessage) => {
    setEditingEventId(eventId);
    setEditedMessage(currentMessage);
    setDropdownVisible(null); // Close dropdown when editing starts
  };

  const handleSaveEvent = (eventId) => {
    setAllEvents(
      allEvents.map((event) =>
        event.id === eventId ? { ...event, message: editedMessage } : event
      )
    );
    setEditingEventId(null);
  };

  // Delete Event
  const handleDeleteEvent = (eventId) => {
    setAllEvents(allEvents.filter((event) => event.id !== eventId));
    setDropdownVisible(null); // Close dropdown when deleting
  };

  // Add Comment
  const handleAddComment = (eventId) => {
    if (newComment.trim() !== '') {
      setAllEvents(
        allEvents.map((event) =>
          event.id === eventId
            ? { ...event, comments: [...event.comments, newComment] }
            : event
        )
      );
      setNewComment('');
    }
  };

  // Toggle Comment Section
  const toggleCommentSection = (eventId) => {
    setVisibleCommentEventId(visibleCommentEventId === eventId ? null : eventId);
  };

  // Toggle Three-Dot Dropdown
  const toggleDropdown = (eventId) => {
    setDropdownVisible(dropdownVisible === eventId ? null : eventId);
  };

  // Pagination logic
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = allEvents.slice(startIndex, startIndex + eventsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="timeline-container">
      {/* Event Add Section - Now in the format of a timeline event */}
      <div className="timeline-event">
        <div className="user-icon">
          <span className="user-initials">You</span>
        </div>

        <div className="event-details">
          <div className="event-header">
            <span className="author">You</span>
            <span className="timestamp">{new Date().toLocaleString()}</span>
          </div>

          <div className="event-message">
            <textarea
              className="event-textarea"
              placeholder="Add an event to the timeline"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
            ></textarea>
            <button className="submit-event" onClick={handleAddEvent}>
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Events List (Scrollable) */}
      <div className="events-list">
        {currentEvents.map((event) => (
          <div key={event.id} className="timeline-event">
            {/* User Icon */}
            <div className="user-icon">
              <span className="user-initials">BP</span>
            </div>

            {/* Event Details */}
            <div className="event-details">
              <div className="event-header">
                <span className="author">{event.author}</span>
                
                <div className="timestamp-actions">
                  {/* Comment Icon */}
                  <button className="comment-icon" onClick={() => toggleCommentSection(event.id)}>
                    💬
                  </button>
                  
                  {/* Three Dot Menu for Edit/Delete */}
                  <button className="three-dot-menu" onClick={() => toggleDropdown(event.id)}>
                    ⋮
                  </button>
                  
                  {/* Dropdown */}
                  {dropdownVisible === event.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEditEvent(event.id, event.message)}>Edit</button>
                      <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                    </div>
                  )}

                  <span className="timestamp">{event.timestamp}</span>
                </div>
              </div>

              {/* Event Message (editable or static) */}
              <div className="event-message">
                {editingEventId === event.id ? (
                  <>
                    <textarea
                      value={editedMessage}
                      onChange={(e) => setEditedMessage(e.target.value)}
                    />
                    <button onClick={() => handleSaveEvent(event.id)}>Save</button>
                    <button onClick={() => setEditingEventId(null)}>Cancel</button>
                  </>
                ) : (
                  <p>
                    {event.message}{' '}
                    {event.status && (
                      <span className={`status-badge ${event.statusType}`}>
                        {event.status}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Comment Section (Visible only if toggled) */}
              {visibleCommentEventId === event.id && (
                <div className="comment-section">
                  <textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button onClick={() => handleAddComment(event.id)}>Comment</button>
                </div>
              )}

              {/* Conversation Thread */}
              {event.comments.length > 0 && visibleCommentEventId === event.id && (
                <div className="conversation-thread">
                  {event.comments.map((comment, index) => (
                    <div key={index} className="conversation-comment">
                      <div className="user-icon">
                        <span className="user-initials">BP</span>
                      </div>
                      <div className="comment-details">
                        <p>{comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Timeline;
