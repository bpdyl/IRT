// import React, { useState } from 'react';
// import './Timeline.scss';

// const Timeline = () => {
//   const eventsPerPage = 5;  // Number of events per page
//   const [currentPage, setCurrentPage] = useState(1);
//   const [allEvents, setAllEvents] = useState([
//     {
//       id: 1,
//       author: 'Bibek Paudyal',
//       timestamp: 'Sep 4 07:33:52 PM +0545',
//       message: 'marked incident as',
//       status: 'resolved',
//       statusType: 'success',
//       comments: [],
//     },
//     {
//       id: 2,
//       author: 'Bibek Paudyal',
//       timestamp: 'Sep 4 07:33:52 PM +0545',
//       message: 'marked incident as',
//       status: 'mitigated',
//       statusType: 'warning',
//       comments: [],
//     },
//     {
//       id: 3,
//       author: 'Bibek Paudyal',
//       timestamp: 'Sep 3 07:44:52 PM +0545',
//       message: 'New certificate in place. www.domain is available through HTTPS again',
//       comments: [],
//     },
//     {
//       id: 4,
//       author: 'Bibek Paudyal',
//       timestamp: 'Sep 3 07:42:52 PM +0545',
//       message: 'Certificate is being deployed',
//       comments: [],
//     },
//   ]);

//   const [newEvent, setNewEvent] = useState(''); // State for new event input
//   const [editingEventId, setEditingEventId] = useState(null);
//   const [editedMessage, setEditedMessage] = useState('');
//   const [newComment, setNewComment] = useState('');
//   const [visibleCommentEventId, setVisibleCommentEventId] = useState(null); // For toggling comment section visibility
//   const [dropdownVisible, setDropdownVisible] = useState(null); // For showing/hiding three-dot dropdown

//   // Add Event
//   const handleAddEvent = () => {
//     if (newEvent.trim()) {
//       const newEntry = {
//         id: allEvents.length + 1,
//         author: 'You',
//         timestamp: new Date().toLocaleString(),
//         message: newEvent,
//         status: '',
//         comments: [],
//       };
//       setAllEvents([newEntry, ...allEvents]);
//       setNewEvent(''); // Clear input field
//     }
//   };

//   // Edit Event
//   const handleEditEvent = (eventId, currentMessage) => {
//     setEditingEventId(eventId);
//     setEditedMessage(currentMessage);
//     setDropdownVisible(null); // Close dropdown when editing starts
//   };

//   const handleSaveEvent = (eventId) => {
//     setAllEvents(
//       allEvents.map((event) =>
//         event.id === eventId ? { ...event, message: editedMessage } : event
//       )
//     );
//     setEditingEventId(null);
//   };

//   // Delete Event
//   const handleDeleteEvent = (eventId) => {
//     setAllEvents(allEvents.filter((event) => event.id !== eventId));
//     setDropdownVisible(null); // Close dropdown when deleting
//   };

//   // Add Comment
//   const handleAddComment = (eventId) => {
//     if (newComment.trim() !== '') {
//       setAllEvents(
//         allEvents.map((event) =>
//           event.id === eventId
//             ? { ...event, comments: [...event.comments, newComment] }
//             : event
//         )
//       );
//       setNewComment('');
//     }
//   };

//   // Toggle Comment Section
//   const toggleCommentSection = (eventId) => {
//     setVisibleCommentEventId(visibleCommentEventId === eventId ? null : eventId);
//   };

//   // Toggle Three-Dot Dropdown
//   const toggleDropdown = (eventId) => {
//     setDropdownVisible(dropdownVisible === eventId ? null : eventId);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(allEvents.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const currentEvents = allEvents.slice(startIndex, startIndex + eventsPerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="timeline-container">
//       {/* Event Add Section - Now in the format of a timeline event */}
//       <div className="timeline-event">
//         <div className="user-icon">
//           <span className="user-initials">You</span>
//         </div>

//         <div className="event-details">
//           <div className="event-header">
//             <span className="author">You</span>
//             <span className="timestamp">{new Date().toLocaleString()}</span>
//           </div>

//           <div className="event-message">
//             <textarea
//               className="event-textarea"
//               placeholder="Add an event to the timeline"
//               value={newEvent}
//               onChange={(e) => setNewEvent(e.target.value)}
//             ></textarea>
//             <button className="submit-event" onClick={handleAddEvent}>
//               Submit
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Timeline Events List (Scrollable) */}
//       <div className="events-list">
//         {currentEvents.map((event) => (
//           <div key={event.id} className="timeline-event">
//             {/* User Icon */}
//             <div className="user-icon">
//               <span className="user-initials">BP</span>
//             </div>

//             {/* Event Details */}
//             <div className="event-details">
//               <div className="event-header">
//                 <span className="author">{event.author}</span>
                
//                 <div className="timestamp-actions">
//                   {/* Comment Icon */}
//                   <button className="comment-icon" onClick={() => toggleCommentSection(event.id)}>
//                     💬
//                   </button>
                  
//                   {/* Three Dot Menu for Edit/Delete */}
//                   <button className="three-dot-menu" onClick={() => toggleDropdown(event.id)}>
//                     ⋮
//                   </button>
                  
//                   {/* Dropdown */}
//                   {dropdownVisible === event.id && (
//                     <div className="dropdown-menu">
//                       <button onClick={() => handleEditEvent(event.id, event.message)}>Edit</button>
//                       <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
//                     </div>
//                   )}

//                   <span className="timestamp">{event.timestamp}</span>
//                 </div>
//               </div>

//               {/* Event Message (editable or static) */}
//               <div className="event-message">
//                 {editingEventId === event.id ? (
//                   <>
//                     <textarea
//                       value={editedMessage}
//                       onChange={(e) => setEditedMessage(e.target.value)}
//                     />
//                     <button onClick={() => handleSaveEvent(event.id)}>Save</button>
//                     <button onClick={() => setEditingEventId(null)}>Cancel</button>
//                   </>
//                 ) : (
//                   <p>
//                     {event.message}{' '}
//                     {event.status && (
//                       <span className={`status-badge ${event.statusType}`}>
//                         {event.status}
//                       </span>
//                     )}
//                   </p>
//                 )}
//               </div>

//               {/* Comment Section (Visible only if toggled) */}
//               {visibleCommentEventId === event.id && (
//                 <div className="comment-section">
//                   <textarea
//                     placeholder="Add a comment..."
//                     value={newComment}
//                     onChange={(e) => setNewComment(e.target.value)}
//                   ></textarea>
//                   <button onClick={() => handleAddComment(event.id)}>Comment</button>
//                 </div>
//               )}

//               {/* Conversation Thread */}
//               {event.comments.length > 0 && visibleCommentEventId === event.id && (
//                 <div className="conversation-thread">
//                   {event.comments.map((comment, index) => (
//                     <div key={index} className="conversation-comment">
//                       <div className="user-icon">
//                         <span className="user-initials">BP</span>
//                       </div>
//                       <div className="comment-details">
//                         <p>{comment}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination Bar */}
//       <div className="pagination">
//         <button
//           className="pagination-button"
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="page-info">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="pagination-button"
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Timeline;

import React, { useState, useEffect } from 'react';
import './Timeline.scss';
import { useAuth0 } from '@auth0/auth0-react';
import { useTimelineService } from '../../../../../services/timelineService';



const Timeline = ({ incidentId }) => {
  const {
    getTimelineEvents,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addComment,
  } = useTimelineService();

  const { user: currentUser, isAuthenticated, isLoading } = useAuth0();
  // const { currentUser } = useAuth(); // Assume this hook provides current user info
  const currentUserId = currentUser ? currentUser.id : null;

  const eventsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [newComments, setNewComments] = useState({});
  const [visibleCommentEventId, setVisibleCommentEventId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch timeline events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getTimelineEvents(incidentId);
        setAllEvents(response);
      } catch (err) {
        console.error('Error fetching timeline events:', err);
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [incidentId]);

  // Add Event
  const handleAddEvent = async () => {
    if (newEvent.trim()) {
      try {
        const newEntryData = {
          message: newEvent,
          event_type: 'user_note', // Use a default event type or allow user selection
        };
        const response = await createTimelineEvent(incidentId, newEntryData);
        const newEntry = response.data;
        setAllEvents([newEntry, ...allEvents]);
        setNewEvent('');
      } catch (error) {
        console.error('Error adding event:', error);
        setError('Failed to add event.');
      }
    }
  };

  // Edit Event
  const handleEditEvent = (eventId, currentMessage) => {
    setEditingEventId(eventId);
    setEditedMessage(currentMessage);
    setDropdownVisible(null);
  };

  const handleSaveEvent = async (eventId) => {
    try {
      const updatedEventData = {
        message: editedMessage,
      };
      const response = await updateTimelineEvent(eventId, updatedEventData);
      const updatedEvent = response.data;

      setAllEvents(
        allEvents.map((event) =>
          event.id === eventId ? updatedEvent : event
        )
      );
      setEditingEventId(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event.');
    }
  };

  // Delete Event
  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteTimelineEvent(eventId);
      setAllEvents(allEvents.filter((event) => event.id !== eventId));
      setDropdownVisible(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('Failed to delete event.');
    }
  };

  // Add Comment
  const handleAddComment = async (eventId) => {
    const commentText = newComments[eventId];
    if (commentText && commentText.trim() !== '') {
      try {
        const commentData = {
          message: commentText,
        };
        const response = await addComment(eventId, commentData);
        const newCommentObj = response.data;

        setAllEvents(
          allEvents.map((event) =>
            event.id === eventId
              ? { ...event, comments: [...event.comments, newCommentObj] }
              : event
          )
        );

        setNewComments({ ...newComments, [eventId]: '' });
      } catch (error) {
        console.error('Error adding comment:', error);
        setError('Failed to add comment.');
      }
    }
  };

  // Toggle Comment Section
  const toggleCommentSection = (eventId) => {
    setVisibleCommentEventId(
      visibleCommentEventId === eventId ? null : eventId
    );
  };

  // Toggle Three-Dot Dropdown
  const toggleDropdown = (eventId) => {
    setDropdownVisible(dropdownVisible === eventId ? null : eventId);
  };

  // Pagination logic
  const totalPages = Math.ceil(allEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = allEvents.slice(
    startIndex,
    startIndex + eventsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="timeline-container">
      {error && <div className="error-message">{error}</div>}

      {/* Event Add Section */}
      <div className="timeline-event">
        <div className="user-icon">
          <span className="user-initials">
            {currentUser
              ? currentUser.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : currentUser.email.charAt(0).toUpperCase()
              : 'U'}
          </span>
        </div>

        <div className="event-details">
          <div className="event-header">
            <span className="author">
              {currentUser
                ? currentUser.name || currentUser.email || 'Unknown'
                : 'You'}
            </span>
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

      {loading ? (
        <div className="loading-message">Loading...</div>
      ) : (
        <>
          {/* Timeline Events List */}
          <div className="events-list">
            {currentEvents.map((event) => (
              <div key={event.id} className="timeline-event">
                {/* User Icon */}
                <div className="user-icon">
                  <span className="user-initials">
                    {event.author
                      ? event.author.name
                        ? event.author.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()
                        : event.author.email
                        ? event.author.email.charAt(0).toUpperCase()
                        : 'U'
                      : 'S'}
                  </span>
                </div>

                {/* Event Details */}
                <div className="event-details">
                  <div className="event-header">
                    <span className="author">
                      {event.author
                        ? event.author.name ||
                          event.author.email ||
                          'Unknown'
                        : 'System'}
                    </span>

                    <div className="timestamp-actions">
                      {/* Comment Icon */}
                      <button
                        className="comment-icon"
                        onClick={() => toggleCommentSection(event.id)}
                      >
                        💬
                      </button>

                      {/* Show edit/delete options only if the current user is the author */}
                      {event.author && event.author._id === currentUserId && (
                        <>
                          <button
                            className="three-dot-menu"
                            onClick={() => toggleDropdown(event.id)}
                          >
                            ⋮
                          </button>

                          {/* Dropdown */}
                          {dropdownVisible === event.id && (
                            <div className="dropdown-menu">
                              <button
                                onClick={() =>
                                  handleEditEvent(event.id, event.message)
                                }
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      <span className="timestamp">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Event Message */}
                  <div className="event-message">
                    {editingEventId === event.id ? (
                      <>
                        <textarea
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                        />
                        <button onClick={() => handleSaveEvent(event.id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingEventId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <p>
                        {event.message}{' '}
                        {event.event_type && (
                          <span className="event-type">
                            {event.event_type}
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Comment Section */}
                  {visibleCommentEventId === event.id && (
                    <div className="comment-section">
                      <textarea
                        placeholder="Add a comment..."
                        value={newComments[event.id] || ''}
                        onChange={(e) =>
                          setNewComments({
                            ...newComments,
                            [event.id]: e.target.value,
                          })
                        }
                      ></textarea>
                      <button onClick={() => handleAddComment(event.id)}>
                        Comment
                      </button>
                    </div>
                  )}

                  {/* Conversation Thread */}
                  {event.comments &&
                    event.comments.length > 0 &&
                    visibleCommentEventId === event.id && (
                      <div className="conversation-thread">
                        {event.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="conversation-comment"
                          >
                            <div className="user-icon">
                              <span className="user-initials">
                                {comment.author
                                  ? comment.author.name
                                    ? comment.author.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')
                                        .toUpperCase()
                                    : comment.author.email
                                    ? comment.author.email
                                        .charAt(0)
                                        .toUpperCase()
                                    : 'U'
                                  : 'S'}
                              </span>
                            </div>
                            <div className="comment-details">
                              <span className="author">
                                {comment.author
                                  ? comment.author.name ||
                                    comment.author.email ||
                                    'Unknown'
                                  : 'System'}
                              </span>
                              <p>{comment.message}</p>
                              <span className="comment-timestamp">
                                {new Date(comment.timestamp).toLocaleString()}
                              </span>
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
          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default Timeline;
