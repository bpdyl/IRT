// //Timeline.jsx
// import React, { useState, useEffect } from 'react';
// import './Timeline.scss';
// import { useAuth0 } from '@auth0/auth0-react';
// import { useTimelineService } from '../../../../../services/timelineService';
// import { Button, Alert } from 'react-bootstrap';


// const Timeline = ({ incidentId }) => {
//   const {
//     getTimelineEvents,
//     createTimelineEvent,
//     updateTimelineEvent,
//     deleteTimelineEvent,
//     addComment,
//   } = useTimelineService();

//   const { user: currentUser, isAuthenticated, isLoading } = useAuth0();
//   // const { currentUser } = useAuth(); // Assume this hook provides current user info
//   const currentUserEmail = currentUser ? currentUser.email : null;

//   const eventsPerPage = 5;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [allEvents, setAllEvents] = useState([]);
//   const [newEvent, setNewEvent] = useState('');
//   const [editingEventId, setEditingEventId] = useState(null);
//   const [editedMessage, setEditedMessage] = useState('');
//   const [newComments, setNewComments] = useState({});
//   const [visibleCommentEventId, setVisibleCommentEventId] = useState(null);
//   const [dropdownVisible, setDropdownVisible] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch timeline events from the backend
//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await getTimelineEvents(incidentId);
//         setAllEvents(response);
//       } catch (err) {
//         console.error('Error fetching timeline events:', err);
//         setError('Failed to load events.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, [incidentId]);

//   // Add Event
//   const handleAddEvent = async () => {
//     if (newEvent.trim()) {
//       try {
//         const newEntryData = {
//           message: newEvent,
//           event_type: 'user_note', // Use a default event type or allow user selection
//         };
//         const response = await createTimelineEvent(incidentId, newEntryData);
//         const newEntry = response;
//         setAllEvents([newEntry, ...allEvents]);
//         setNewEvent('');
//       } catch (error) {
//         console.error('Error adding event:', error);
//         setError('Failed to add event.');
//       }
//     }
//   };

//   // Edit Event
//   const handleEditEvent = (eventId, currentMessage) => {
//     setEditingEventId(eventId);
//     setEditedMessage(currentMessage);
//     setDropdownVisible(null);
//   };

//   const handleSaveEvent = async (eventId) => {
//     try {
//       const updatedEventData = {
//         message: editedMessage,
//       };
//       const response = await updateTimelineEvent(eventId, updatedEventData);
//       const updatedEvent = response;

//       setAllEvents(
//         allEvents.map((event) =>
//           event.id === eventId ? updatedEvent : event
//         )
//       );
//       setEditingEventId(null);
//     } catch (error) {
//       console.error('Error updating event:', error);
//       setError('Failed to update event.');
//     }
//   };

//   // Delete Event
//   const handleDeleteEvent = async (eventId) => {
//     try {
//       await deleteTimelineEvent(eventId);
//       setAllEvents(allEvents.filter((event) => event.id !== eventId));
//       setDropdownVisible(null);
//     } catch (error) {
//       console.error('Error deleting event:', error);
//       setError('Failed to delete event.');
//     }
//   };

//   // Add Comment
//   const handleAddComment = async (eventId) => {
//     const commentText = newComments[eventId];
//     if (commentText && commentText.trim() !== '') {
//       try {
//         const commentData = {
//           message: commentText,
//         };
//         const response = await addComment(eventId, commentData);
//         const newCommentObj = response;

//         setAllEvents(
//           allEvents.map((event) =>
//             event.id === eventId
//               ? { ...event, comments: [...event.comments, newCommentObj] }
//               : event
//           )
//         );

//         setNewComments({ ...newComments, [eventId]: '' });
//       } catch (error) {
//         console.error('Error adding comment:', error);
//         setError('Failed to add comment.');
//       }
//     }
//   };

//   // Toggle Comment Section
//   const toggleCommentSection = (eventId) => {
//     setVisibleCommentEventId(
//       visibleCommentEventId === eventId ? null : eventId
//     );
//   };

//   // Toggle Three-Dot Dropdown
//   const toggleDropdown = (eventId) => {
//     setDropdownVisible(dropdownVisible === eventId ? null : eventId);
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(allEvents.length / eventsPerPage);
//   const startIndex = (currentPage - 1) * eventsPerPage;
//   const currentEvents = allEvents.slice(
//     startIndex,
//     startIndex + eventsPerPage
//   );

//   console.log('Current Events : ', currentEvents);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   return (
//     <div className="timeline-container">
//       {/* {error && <div className="error-message">{error}</div>} */}
//       {error && <Alert variant="danger" className="my-4 text-center">{error}</Alert>}

//       {/* Event Add Section */}
//       <div className="timeline-event">
//         <div className="user-icon">
//           <span className="user-initials">
//             {currentUser
//               ? currentUser.name
//                 ? currentUser.name
//                     .split(' ')
//                     .map((n) => n[0])
//                     .join('')
//                     .toUpperCase()
//                 : currentUser.email.charAt(0).toUpperCase()
//               : 'U'}
//           </span>
//         </div>

//         <div className="event-details">
//           <div className="event-header">
//             <span className="author">
//               {currentUser
//                 ? currentUser.name || currentUser.email || 'Unknown'
//                 : 'You'}
//             </span>
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

//       {loading ? (
//         <div className="loading-message">Loading...</div>
//       ) : (
//         <>
//           {/* Timeline Events List */}
//           <div className="events-list">
//             {currentEvents.map((event) => (
//               <div key={event.id} className="timeline-event">
//                 {/* User Icon */}
//                 <div className="user-icon">
//                   <span className="user-initials">
//                     {event.author
//                       ? event.author.name
//                         ? event.author.name
//                             .split(' ')
//                             .map((n) => n[0])
//                             .join('')
//                             .toUpperCase()
//                         : event.author.email
//                         ? event.author.email.charAt(0).toUpperCase()
//                         : 'U'
//                       : 'S'}
//                   </span>
//                 </div>

//                 {/* Event Details */}
//                 <div className="event-details">
//                   <div className="event-header">
//                     <span className="author">
//                       {event.author
//                         ? event.author.name ||' ' ||
//                           event.author.email || ' ' ||
//                           'Unknown '
//                         : 'System '} 
//                     </span>
//                     <div className="timestamp-actions">
//                       {/* Comment Icon */}
//                       <button
//                         className="comment-icon"
//                         onClick={() => toggleCommentSection(event.id)}
//                       >
//                         💬
//                       </button>


//                       {/* Show edit/delete options only if the current user is the author */}
//                       {event.author && event.author.email === currentUserEmail && (
//                         <>
//                           <button
//                             className="three-dot-menu"
//                             onClick={() => toggleDropdown(event.id)}
//                           >
//                             ⋮
//                           </button>

//                           {/* Dropdown */}
//                           {dropdownVisible === event.id && (
//                             <div className="dropdown-menu">
//                               <button
//                                 onClick={() =>
//                                   handleEditEvent(event.id, event.message)
//                                 }
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteEvent(event.id)}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </>
//                       )}

//                       <span className="timestamp">
//                         {new Date(event.timestamp).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Event Message */}
//                   <div className="event-message">
//                     {editingEventId === event.id ? (
//                       <div>
//                         <textarea 
//                           className="inline-textarea"
//                           value={editedMessage}
//                           onChange={(e) => setEditedMessage(e.target.value)}
//                         />
//                         <div className="edit-controls">
//                           <button className="save-button" onClick={() => handleSaveEvent(event.id)}>
//                             ✓
//                           </button>
//                           <button className="cancel-button" onClick={() => setEditingEventId(null)}>
//                             X
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <p>
//                         {event.message}{' '}
//                         {event.event_type && (
//                           <span className="event-type">
//                             {event.event_type}
//                           </span>
//                         )}
//                       </p>
//                     )}
//                   </div>

//                   {/* Comment Section */}
//                   {visibleCommentEventId === event.id && (
//                     <div className="comment-section">
//                       <textarea
//                         placeholder="Add a comment..."
//                         value={newComments[event.id] || ''}
//                         onChange={(e) =>
//                           setNewComments({
//                             ...newComments,
//                             [event.id]: e.target.value,
//                           })
//                         }
//                       ></textarea>
//                       <button onClick={() => handleAddComment(event.id)}>
//                         Comment
//                       </button>
//                     </div>
//                   )}

//                   {/* Conversation Thread */}
//                   {event.comments &&
//                     event.comments.length > 0 &&
//                     visibleCommentEventId === event.id && (
//                       <div className="conversation-thread">
//                         {event.comments.map((comment) => (
//                           <div
//                             key={comment.id}
//                             className="conversation-comment"
//                           >
//                             <div className="user-icon">
//                               <span className="user-initials">
//                                 {comment.author
//                                   ? comment.author.name
//                                     ? comment.author.name
//                                         .split(' ')
//                                         .map((n) => n[0])
//                                         .join('')
//                                         .toUpperCase()
//                                     : comment.author.email
//                                     ? comment.author.email
//                                         .charAt(0)
//                                         .toUpperCase()
//                                     : 'U'
//                                   : 'S'}
//                               </span>
//                             </div>
//                             <div className="comment-details">
//                               <span className="author">
//                                 {comment.author
//                                   ? comment.author.name ||
//                                     comment.author.email ||
//                                     'Unknown'
//                                   : 'System'}
//                               </span>
//                               <p>{comment.message}</p>
//                               <span className="comment-timestamp">
//                                 {new Date(comment.timestamp).toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Bar */}
//           {totalPages > 1 && (
//             <div className="pagination">
//               <button
//                 className="pagination-button"
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//               >
//                 Previous
//               </button>
//               <span className="page-info">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 className="pagination-button"
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Timeline;

// Timeline.jsx

import React, { useState, useEffect } from 'react';
import './Timeline.scss';
import { useAuth0 } from '@auth0/auth0-react';
import { useTimelineService } from '../../../../../services/timelineService';
import { Alert } from 'react-bootstrap';
import DOMPurify from 'dompurify';

const Timeline = ({
  incidentId,
  showPagination = true,
  showCommentToggle = true,
  eventsPerPage = 5,
  enableScroll = true, // New prop to control scroll behavior
}) => {
  const {
    getTimelineEvents,
    createTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addComment,
  } = useTimelineService();

  const { user: currentUser } = useAuth0();
  const currentUserEmail = currentUser ? currentUser.email : null;

  const [currentPage, setCurrentPage] = useState(1);
  const [allEvents, setAllEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [editingEventId, setEditingEventId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [newComments, setNewComments] = useState({});
  const [visibleCommentEventIds, setVisibleCommentEventIds] = useState([]);
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

  // Ensure all comments are visible when showCommentToggle is false
  useEffect(() => {
    if (!showCommentToggle) {
      // Set all event IDs to visibleCommentEventIds
      const allEventIds = allEvents.map((event) => event.id);
      setVisibleCommentEventIds(allEventIds);
    }
  }, [showCommentToggle, allEvents]);

  // Add Event
  const handleAddEvent = async () => {
    if (newEvent.trim()) {
      try {
        const newEntryData = {
          message: newEvent,
          event_type: 'user_note', // Use a default event type or allow user selection
        };
        const response = await createTimelineEvent(incidentId, newEntryData);
        const newEntry = response;
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
      const updatedEvent = response;

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
        const newCommentObj = response;

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
    if (showCommentToggle) {
      setVisibleCommentEventIds((prevIds) =>
        prevIds.includes(eventId)
          ? prevIds.filter((id) => id !== eventId)
          : [...prevIds, eventId]
      );
    }
  };

  // Toggle Three-Dot Dropdown
  const toggleDropdown = (eventId) => {
    setDropdownVisible(dropdownVisible === eventId ? null : eventId);
  };

  // Pagination logic
  const totalPages = showPagination
    ? Math.ceil(allEvents.length / eventsPerPage)
    : 1;

  const startIndex = showPagination ? (currentPage - 1) * eventsPerPage : 0;

  const currentEvents = showPagination
    ? allEvents.slice(startIndex, startIndex + eventsPerPage)
    : allEvents; // Display all events when pagination is disabled

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helper function to get user initials
  const getUserInitials = (user) => {
    if (user) {
      if (user.name) {
        return user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
      } else if (user.email) {
        return user.email.charAt(0).toUpperCase();
      }
    }
    return 'U';
  };

  return (
    <div className="timeline-container">
      {error && (
        <Alert variant="danger" className="my-4 text-center">
          {error}
        </Alert>
      )}

      {/* Event Add Section */}
      <div className="timeline-event">
        <div className="user-icon">
          <span className="user-initials">{getUserInitials(currentUser)}</span>
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
          <div className={`events-list ${
      enableScroll ? 'scroll-enabled' : 'scroll-disabled'
    }`}>
            {currentEvents.map((event) => (
              <div key={event.id} className="timeline-event">
                {/* User Icon */}
                <div className="user-icon">
                  <span className="user-initials">
                    {getUserInitials(event.author)}
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
                      {showCommentToggle && (
                        <button
                          className="comment-icon"
                          onClick={() => toggleCommentSection(event.id)}
                        >
                          💬
                        </button>
                      )}

                      {/* Show edit/delete options only if the current user is the author */}
                      {event.author &&
                        event.author.email === currentUserEmail && (
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
                      <div>
                        <textarea
                          className="inline-textarea"
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                        />
                        <div className="edit-controls">
                          <button
                            className="save-button"
                            onClick={() => handleSaveEvent(event.id)}
                          >
                            ✓
                          </button>
                          <button
                            className="cancel-button"
                            onClick={() => setEditingEventId(null)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(event.message),
                        }}
                      ></p>
                    )}
                  </div>

                  {/* Comment Section */}
                  {(showCommentToggle
                    ? visibleCommentEventIds.includes(event.id)
                    : true) && (
                    <>
                      {/* Comment Input */}
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

                      {/* Conversation Thread */}
                      {event.comments && event.comments.length > 0 && (
                        <div className="conversation-thread">
                          {event.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="conversation-comment"
                            >
                              <div className="user-icon">
                                <span className="user-initials">
                                  {getUserInitials(comment.author)}
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
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(comment.message),
                                  }}
                                ></p>
                                <span className="comment-timestamp">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Bar */}
          {showPagination && totalPages > 1 && (
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
