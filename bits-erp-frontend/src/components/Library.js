import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Form, Button, Badge, Alert, Modal, Tabs, Tab, ProgressBar } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Library() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [digitalResources, setDigitalResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [searchType, setSearchType] = useState('title');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showBookDetailsModal, setShowBookDetailsModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('search');
  const [libraryStats, setLibraryStats] = useState({});
  const [readingHistory, setReadingHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const searchBooks = useCallback(async () => {
    try {
      const response = await axios.get('/api/library/books/search', {
        params: { 
          query: searchQuery, 
          category: searchCategory,
          type: searchType 
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error searching books:', error);
      // Enhanced mock data with more book details
      setBooks([
        {
          book_id: '1',
          isbn: '978-0-13-110362-7',
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
          publisher: 'McGraw-Hill',
          publication_year: 2019,
          edition: '7th Edition',
          category: 'Computer Science',
          subcategory: 'Database Management',
          total_copies: 5,
          available_copies: 3,
          location: 'CS Section - A1 - Shelf 15',
          description: 'Comprehensive guide to database systems covering SQL, NoSQL, and modern database technologies.',
          pages: 1376,
          language: 'English',
          rating: 4.5,
          reviews_count: 234,
          tags: ['Database', 'SQL', 'DBMS', 'Computer Science'],
          cover_image: '/images/books/database-concepts.jpg',
          digital_available: true,
          popular: true
        },
        {
          book_id: '2',
          isbn: '978-0-262-03384-8',
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest',
          publisher: 'MIT Press',
          publication_year: 2009,
          edition: '3rd Edition',
          category: 'Computer Science',
          subcategory: 'Algorithms',
          total_copies: 8,
          available_copies: 5,
          location: 'CS Section - A2 - Shelf 8',
          description: 'The definitive guide to algorithms and data structures used in computer science.',
          pages: 1312,
          language: 'English',
          rating: 4.8,
          reviews_count: 456,
          tags: ['Algorithms', 'Data Structures', 'Computer Science'],
          cover_image: '/images/books/intro-algorithms.jpg',
          digital_available: true,
          popular: true
        },
        {
                    book_id: '3',
          isbn: '978-0-321-57351-3',
          title: 'Operating System Concepts',
          author: 'Abraham Silberschatz, Peter B. Galvin, Greg Gagne',
          publisher: 'Wiley',
          publication_year: 2018,
          edition: '10th Edition',
          category: 'Computer Science',
          subcategory: 'Operating Systems',
          total_copies: 6,
          available_copies: 4,
          location: 'CS Section - A3 - Shelf 12',
          description: 'Comprehensive coverage of operating system principles and design.',
          pages: 976,
          language: 'English',
          rating: 4.3,
          reviews_count: 198,
          tags: ['Operating Systems', 'OS', 'Computer Science'],
          cover_image: '/images/books/os-concepts.jpg',
          digital_available: true,
          popular: true
        },
        {
          book_id: '4',
          isbn: '978-0-13-394077-3',
          title: 'Computer Networks',
          author: 'Andrew S. Tanenbaum, David J. Wetherall',
          publisher: 'Pearson',
          publication_year: 2021,
          edition: '6th Edition',
          category: 'Computer Science',
          subcategory: 'Networking',
          total_copies: 4,
          available_copies: 2,
          location: 'CS Section - A4 - Shelf 20',
          description: 'Complete guide to computer networking protocols and technologies.',
          pages: 960,
          language: 'English',
          rating: 4.4,
          reviews_count: 167,
          tags: ['Networks', 'TCP/IP', 'Internet', 'Protocols'],
          cover_image: '/images/books/computer-networks.jpg',
          digital_available: true,
          popular: true
        },
        {
          book_id: '5',
          isbn: '978-0-13-449507-5',
          title: 'Artificial Intelligence: A Modern Approach',
          author: 'Stuart Russell, Peter Norvig',
          publisher: 'Pearson',
          publication_year: 2020,
          edition: '4th Edition',
          category: 'Computer Science',
          subcategory: 'Artificial Intelligence',
          total_copies: 7,
          available_copies: 6,
          location: 'CS Section - A5 - Shelf 25',
          description: 'The most comprehensive, up-to-date introduction to AI theory and practice.',
          pages: 1152,
          language: 'English',
          rating: 4.7,
          reviews_count: 389,
          tags: ['AI', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
          cover_image: '/images/books/ai-modern-approach.jpg',
          digital_available: true,
          popular: true
        }
      ]);
    }
  }, [searchQuery, searchCategory, searchType]);

  useEffect(() => {
    searchBooks();
    fetchTransactions();
    fetchReservations();
    fetchDigitalResources();
    fetchLibraryStats();
    fetchReadingHistory();
    fetchRecommendations();
  }, [searchBooks]);

  const fetchTransactions = async () => {
    try {
      const studentId = user?.student_id || '2021A7PS001P';
      const response = await axios.get(`/api/library/transactions/${studentId}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Enhanced mock data
      setTransactions([
        {
          transaction_id: '1',
          book_id: '1',
          title: 'Database System Concepts',
          author: 'Abraham Silberschatz',
          isbn: '978-0-13-110362-7',
          issue_date: '2025-05-15',
          due_date: '2025-06-15',
          return_date: null,
          fine_amount: 0,
          status: 'issued',
          renewal_count: 0,
          max_renewals: 2,
          location: 'CS Section - A1 - Shelf 15'
        },
        {
          transaction_id: '2',
          book_id: '2',
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen',
          isbn: '978-0-262-03384-8',
          issue_date: '2025-04-10',
          due_date: '2025-05-10',
          return_date: '2025-05-09',
          fine_amount: 0,
          status: 'returned',
          renewal_count: 1,
          max_renewals: 2,
          location: 'CS Section - A2 - Shelf 8'
        },
        {
          transaction_id: '3',
          book_id: '4',
          title: 'Computer Networks',
          author: 'Andrew S. Tanenbaum',
          isbn: '978-0-13-394077-3',
          issue_date: '2025-03-20',
          due_date: '2025-04-20',
          return_date: '2025-04-25',
          fine_amount: 25,
          status: 'returned',
          renewal_count: 0,
          max_renewals: 2,
          location: 'CS Section - A4 - Shelf 20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = () => {
    setReservations([
      {
        reservation_id: '1',
        book_id: '3',
        title: 'Operating System Concepts',
        author: 'Abraham Silberschatz',
        isbn: '978-0-321-57351-3',
        reservation_date: '2025-06-01',
        status: 'active',
        expiry_date: '2025-06-15',
        queue_position: 2,
        estimated_availability: '2025-06-20'
      },
      {
        reservation_id: '2',
        book_id: '5',
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell',
        isbn: '978-0-13-449507-5',
        reservation_date: '2025-06-05',
        status: 'ready',
        expiry_date: '2025-06-12',
        queue_position: 1,
        estimated_availability: '2025-06-12'
      }
    ]);
  };

  const fetchDigitalResources = () => {
    setDigitalResources([
      {
        resource_id: '1',
        title: 'Database System Concepts - eBook',
        type: 'ebook',
        category: 'Computer Science',
        author: 'Abraham Silberschatz',
        file_size: '15.2 MB',
        format: 'PDF',
        access_level: 'all_students',
        download_count: 1234,
        rating: 4.5,
        description: 'Complete digital version with interactive examples'
      },
      {
        resource_id: '2',
        title: 'Introduction to Algorithms - Video Lectures',
        type: 'video_course',
        category: 'Computer Science',
        author: 'MIT OpenCourseWare',
        duration: '24 hours',
        format: 'MP4',
        access_level: 'premium_students',
        view_count: 5678,
        rating: 4.8,
        description: 'Complete video lecture series from MIT'
      },
      {
        resource_id: '3',
        title: 'AI Research Papers Collection',
        type: 'research_papers',
        category: 'Computer Science',
        author: 'Various Authors',
        file_size: '250 MB',
        format: 'PDF Collection',
        access_level: 'faculty_students',
        download_count: 456,
        rating: 4.6,
        description: 'Latest research papers in AI and ML'
      },
      {
        resource_id: '4',
        title: 'Programming Practice Platform',
        type: 'interactive_platform',
        category: 'Computer Science',
        author: 'BITS Library',
        access_level: 'all_students',
        usage_count: 2345,
        rating: 4.4,
        description: 'Interactive coding practice with real-time feedback'
      }
    ]);
  };

  const fetchLibraryStats = () => {
    setLibraryStats({
      totalBooks: 45000,
      totalIssued: 8500,
      totalAvailable: 36500,
      totalMembers: 5000,
      digitalResources: 1200,
      monthlyVisitors: 15000,
      popularCategories: ['Computer Science', 'Mathematics', 'Physics', 'Literature'],
      newArrivals: 156,
      overdueBooks: 234
    });
  };

  const fetchReadingHistory = () => {
    setReadingHistory([
      {
        book_id: '1',
        title: 'Database System Concepts',
        author: 'Abraham Silberschatz',
        category: 'Computer Science',
        last_read: '2025-06-01',
        reading_progress: 75,
        total_pages: 1376,
        pages_read: 1032,
        reading_time: '45 hours',
        notes_count: 23,
        bookmarks: 15
      },
      {
        book_id: '2',
        title: 'Introduction to Algorithms',
        author: 'Thomas H. Cormen',
        category: 'Computer Science',
        last_read: '2025-05-20',
        reading_progress: 40,
        total_pages: 1312,
        pages_read: 525,
        reading_time: '28 hours',
        notes_count: 18,
        bookmarks: 12
      },
      {
        book_id: '4',
        title: 'Computer Networks',
        author: 'Andrew S. Tanenbaum',
        category: 'Computer Science',
        last_read: '2025-04-15',
        reading_progress: 100,
        total_pages: 960,
        pages_read: 960,
        reading_time: '35 hours',
        notes_count: 31,
        bookmarks: 8
      }
    ]);
  };

  const fetchRecommendations = () => {
    setRecommendations([
      {
        book_id: '6',
        title: 'Software Engineering: A Practitioner\'s Approach',
        author: 'Roger S. Pressman',
        category: 'Computer Science',
        rating: 4.2,
        reason: 'Based on your interest in Database Systems',
        availability: 'available',
        recommendation_score: 95
      },
      {
        book_id: '7',
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Gang of Four',
        category: 'Computer Science',
        rating: 4.6,
        reason: 'Popular among students who read Algorithm books',
        availability: 'limited',
        recommendation_score: 88
      },
      {
        book_id: '8',
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        category: 'Computer Science',
        rating: 4.7,
        reason: 'Trending in Computer Science category',
        availability: 'available',
        recommendation_score: 92
      }
    ]);
  };

  const issueBook = async (book) => {
    setSelectedBook(book);
    setShowIssueModal(true);
  };

  const confirmIssueBook = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newTransaction = {
        transaction_id: Date.now().toString(),
        book_id: selectedBook.book_id,
        title: selectedBook.title,
        author: selectedBook.author,
        isbn: selectedBook.isbn,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        return_date: null,
        fine_amount: 0,
        status: 'issued',
        renewal_count: 0,
        max_renewals: 2,
        location: selectedBook.location
      };

      setTransactions(prev => [...prev, newTransaction]);
      
      // Update book availability
      setBooks(prev => prev.map(book => 
        book.book_id === selectedBook.book_id 
          ? { ...book, available_copies: book.available_copies - 1 }
          : book
      ));

      toast.success(`Book "${selectedBook.title}" issued successfully!`);
      setShowIssueModal(false);
    } catch (error) {
      toast.error('Failed to issue book');
    }
  };

  const returnBook = async (transactionId) => {
    try {
      const transaction = transactions.find(t => t.transaction_id === transactionId);
      
      setTransactions(prev => prev.map(t => 
        t.transaction_id === transactionId 
          ? { ...t, status: 'returned', return_date: new Date().toISOString().split('T')[0] }
          : t
      ));

      // Update book availability
      setBooks(prev => prev.map(book => 
        book.book_id === transaction.book_id 
          ? { ...book, available_copies: book.available_copies + 1 }
          : book
      ));

      toast.success('Book returned successfully!');
    } catch (error) {
      toast.error('Failed to return book');
    }
  };

  const renewBook = async (transactionId) => {
    try {
      const transaction = transactions.find(t => t.transaction_id === transactionId);
      
      if (transaction.renewal_count >= transaction.max_renewals) {
        toast.error('Maximum renewals reached');
        return;
      }

      const newDueDate = new Date(transaction.due_date);
      newDueDate.setDate(newDueDate.getDate() + 15);

      setTransactions(prev => prev.map(t => 
        t.transaction_id === transactionId 
          ? { 
              ...t, 
              due_date: newDueDate.toISOString().split('T')[0],
              renewal_count: t.renewal_count + 1
            }
          : t
      ));

      toast.success('Book renewed successfully!');
    } catch (error) {
      toast.error('Failed to renew book');
    }
  };

  const reserveBook = async (book) => {
    try {
      const newReservation = {
        reservation_id: Date.now().toString(),
        book_id: book.book_id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        reservation_date: new Date().toISOString().split('T')[0],
        status: 'active',
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        queue_position: 1,
        estimated_availability: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };

      setReservations(prev => [...prev, newReservation]);
      toast.success(`Book "${book.title}" reserved successfully!`);
    } catch (error) {
      toast.error('Failed to reserve book');
    }
  };

  const cancelReservation = async (reservationId) => {
    try {
      setReservations(prev => prev.filter(r => r.reservation_id !== reservationId));
      toast.success('Reservation cancelled successfully!');
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  const accessDigitalResource = (resource) => {
    if (resource.access_level === 'premium_students' || resource.access_level === 'faculty_students') {
      toast.info('This resource requires special access. Please contact librarian.');
      return;
    }
    
    toast.success(`Accessing ${resource.title}...`);
    // Simulate opening digital resource
    window.open('#', '_blank');
  };

  const getStatusBadge = (status) => {
    const badges = {
      issued: { bg: 'primary', text: 'Issued' },
      returned: { bg: 'success', text: 'Returned' },
      overdue: { bg: 'danger', text: 'Overdue' },
      active: { bg: 'info', text: 'Active' },
      ready: { bg: 'success', text: 'Ready' },
      expired: { bg: 'secondary', text: 'Expired' }
    };
    return badges[status] || badges.issued;
  };

  const isOverdue = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'danger';
    if (percentage <= 20) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading library...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-book text-primary me-3" style={{ fontSize: '2rem' }}></i>
              <div>
                <h2 className="mb-0 text-primary">Digital Library Management</h2>
                <small className="text-muted">Advanced library services with digital resources</small>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-info" onClick={() => setActiveTab('digital')}>
                <i className="fas fa-tablet-alt me-2"></i>
                Digital Resources
              </Button>
              <Button variant="outline-success" onClick={() => setActiveTab('recommendations')}>
                <i className="fas fa-star me-2"></i>
                Recommendations
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Library Statistics */}
      <Row className="mb-4">
        <Col md={2}>
          <Card className="text-center border-primary h-100">
            <Card.Body>
              <i className="fas fa-books text-primary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-primary">{libraryStats.totalBooks?.toLocaleString()}</h4>
              <small className="text-muted">Total Books</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-success h-100">
            <Card.Body>
              <i className="fas fa-book-open text-success mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-success">{libraryStats.totalAvailable?.toLocaleString()}</h4>
              <small className="text-muted">Available</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-warning h-100">
            <Card.Body>
              <i className="fas fa-hand-holding text-warning mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-warning">{libraryStats.totalIssued?.toLocaleString()}</h4>
              <small className="text-muted">Issued</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-info h-100">
            <Card.Body>
              <i className="fas fa-laptop text-info mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-info">{libraryStats.digitalResources?.toLocaleString()}</h4>
              <small className="text-muted">Digital Resources</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-secondary h-100">
            <Card.Body>
              <i className="fas fa-users text-secondary mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-secondary">{libraryStats.monthlyVisitors?.toLocaleString()}</h4>
              <small className="text-muted">Monthly Visitors</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="text-center border-dark h-100">
            <Card.Body>
              <i className="fas fa-plus-circle text-dark mb-2" style={{ fontSize: '1.5rem' }}></i>
              <h4 className="text-dark">{libraryStats.newArrivals}</h4>
              <small className="text-muted">New Arrivals</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="search" title={
          <span>
            <i className="fas fa-search me-2"></i>
            Search Books
          </span>
        }>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-search me-2"></i>
                Advanced Book Search
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search by title, author, ISBN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    size="lg"
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                    size="lg"
                  >
                    <option value="all">All Categories</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Literature">Literature</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    size="lg"
                  >
                    <option value="title">Search by Title</option>
                    <option value="author">Search by Author</option>
                    <option value="isbn">Search by ISBN</option>
                    <option value="keyword">Search by Keywords</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="primary" size="lg" className="w-100" onClick={searchBooks}>
                    <i className="fas fa-search"></i>
                  </Button>
                </Col>
              </Row>

              {books.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No books found matching your search criteria. Try different keywords or browse categories.
                </Alert>
              ) : (
                <div>
                  <div className="mb-3">
                    <small className="text-muted">Found {books.length} books</small>
                  </div>
                  <Table striped bordered hover responsive>
                    <thead className="table-dark">
                      <tr>
                        <th>Book Details</th>
                        <th>Publication Info</th>
                        <th>Category</th>
                        <th>Availability</th>
                        <th>Location</th>
                        <th>Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map((book) => (
                        <tr key={book.book_id}>
                          <td>
                            <div className="fw-bold">{book.title}</div>
                            <small className="text-muted">{book.author}</small>
                            <br />
                            <small className="text-muted">ISBN: {book.isbn}</small>
                          </td>
                          <td>
                            <div>{book.publisher}</div>
                            <small className="text-muted">{book.edition} ({book.publication_year})</small>
                            <br />
                            <small className="text-muted">{book.pages} pages</small>
                          </td>
                          <td>
                            <Badge bg="info" className="mb-1">{book.category}</Badge>
                            <br />
                            <small className="text-muted">{book.subcategory}</small>
                          </td>
                          <td>
                            <Badge bg={getAvailabilityColor(book.available_copies, book.total_copies)}>
                              {book.available_copies}/{book.total_copies}
                            </Badge>
                            <br />
                            {book.digital_available && (
                              <Badge bg="success" className="mt-1">
                                <i className="fas fa-laptop me-1"></i>
                                Digital
                              </Badge>
                            )}
                          </td>
                          <td>
                            <small>{book.location}</small>
                          </td>
                          <td>
                            <div className="text-warning">
                              <i className="fas fa-star"></i> {book.rating}
                            </div>
                            <small className="text-muted">({book.reviews_count})</small>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => issueBook(book)}
                                disabled={book.available_copies === 0}
                              >
                                <i className="fas fa-book me-1"></i>
                                Issue
                              </Button>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => {
                                  setSelectedBook(book);
                                  setShowBookDetailsModal(true);
                                }}
                              >
                                <i className="fas fa-info-circle me-1"></i>
                                Details
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => reserveBook(book)}
                                disabled={book.available_copies > 0}
                              >
                                <i className="fas fa-calendar-plus me-1"></i>
                                Reserve
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="transactions" title={
          <span>
            <i className="fas fa-history me-2"></i>
            My Transactions ({transactions.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i>
                My Library Transactions
              </h5>
            </Card.Header>
            <Card.Body>
              {transactions.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No library transactions found. Start by issuing your first book!
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Book Details</th>
                      <th>Issue Date</th>
                      <th>Due Date</th>
                      <th>Return Date</th>
                      <th>Fine</th>
                      <th>Renewals</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.transaction_id}>
                        <td>
                          <div className="fw-bold">{transaction.title}</div>
                          <small className="text-muted">{transaction.author}</small>
                          <br />
                          <small className="text-muted">ISBN: {transaction.isbn}</small>
                        </td>
                        <td>{new Date(transaction.issue_date).toLocaleDateString()}</td>
                        <td className={isOverdue(transaction.due_date) && !transaction.return_date ? 'text-danger fw-bold' : ''}>
                          {new Date(transaction.due_date).toLocaleDateString()}
                          {isOverdue(transaction.due_date) && !transaction.return_date && (
                            <div><small className="text-danger">OVERDUE</small></div>
                          )}
                        </td>
                        <td>
                          {transaction.return_date ? 
                            new Date(transaction.return_date).toLocaleDateString() : 
                            <span className="text-muted">Not returned</span>
                          }
                        </td>
                        <td>
                          {transaction.fine_amount > 0 ? 
                            <span className="text-danger fw-bold">₹{transaction.fine_amount}</span> : 
                            <span className="text-success">₹0</span>
                          }
                        </td>
                        <td>
                          <Badge bg="info">
                            {transaction.renewal_count}/{transaction.max_renewals}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getStatusBadge(transaction.status).bg}>
                            {getStatusBadge(transaction.status).text}
                          </Badge>
                        </td>
                        <td>
                          {transaction.status === 'issued' && (
                            <div className="d-flex flex-column gap-1">
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => returnBook(transaction.transaction_id)}
                              >
                                <i className="fas fa-undo me-1"></i>
                                Return
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => renewBook(transaction.transaction_id)}
                                disabled={transaction.renewal_count >= transaction.max_renewals}
                              >
                                <i className="fas fa-sync me-1"></i>
                                Renew
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="reservations" title={
          <span>
            <i className="fas fa-calendar-check me-2"></i>
            Reservations ({reservations.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-calendar-check me-2"></i>
                My Book Reservations
              </h5>
            </Card.Header>
            <Card.Body>
              {reservations.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No active reservations. Reserve books that are currently unavailable.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Book Details</th>
                      <th>Reservation Date</th>
                      <th>Queue Position</th>
                      <th>Estimated Availability</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((reservation) => (
                      <tr key={reservation.reservation_id}>
                        <td>
                          <div className="fw-bold">{reservation.title}</div>
                          <small className="text-muted">{reservation.author}</small>
                          <br />
                          <small className="text-muted">ISBN: {reservation.isbn}</small>
                        </td>
                        <td>{new Date(reservation.reservation_date).toLocaleDateString()}</td>
                        <td>
                          <Badge bg="info">#{reservation.queue_position}</Badge>
                        </td>
                        <td>{new Date(reservation.estimated_availability).toLocaleDateString()}</td>
                        <td>{new Date(reservation.expiry_date).toLocaleDateString()}</td>
                        <td>
                          <Badge bg={getStatusBadge(reservation.status).bg}>
                            {getStatusBadge(reservation.status).text}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {reservation.status === 'ready' && (
                              <Button
                                variant="success"
                                size="sm"
                                onClick={() => issueBook({ 
                                  book_id: reservation.book_id,
                                  title: reservation.title,
                                  author: reservation.author,
                                  isbn: reservation.isbn
                                })}
                              >
                                <i className="fas fa-book me-1"></i>
                                Issue Now
                              </Button>
                            )}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => cancelReservation(reservation.reservation_id)}
                            >
                              <i className="fas fa-times me-1"></i>
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="digital" title={
          <span>
            <i className="fas fa-tablet-alt me-2"></i>
            Digital Resources ({digitalResources.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-tablet-alt me-2"></i>
                Digital Library Resources
              </h5>
            </Card.Header>
            <Card.Body>
              {digitalResources.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No digital resources available at the moment.
                </Alert>
              ) : (
                <Row>
                  {digitalResources.map((resource) => (
                    <Col md={6} lg={4} key={resource.resource_id} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className={`bg-${resource.type === 'ebook' ? 'primary' : resource.type === 'video_course' ? 'success' : 'info'} text-white`}>
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="light" text="dark">
                              {resource.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <div className="text-warning">
                              <i className="fas fa-star"></i> {resource.rating}
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <h6 className="fw-bold mb-2">{resource.title}</h6>
                          <p className="text-muted small mb-2">{resource.author}</p>
                          <p className="small mb-3">{resource.description}</p>
                          
                          <div className="mb-3">
                            <div className="d-flex justify-content-between small">
                              <span>Category:</span>
                              <Badge bg="secondary">{resource.category}</Badge>
                            </div>
                            {resource.file_size && (
                              <div className="d-flex justify-content-between small">
                                <span>Size:</span>
                                <span>{resource.file_size}</span>
                              </div>
                            )}
                            {resource.duration && (
                              <div className="d-flex justify-content-between small">
                                <span>Duration:</span>
                                <span>{resource.duration}</span>
                              </div>
                            )}
                            <div className="d-flex justify-content-between small">
                              <span>Format:</span>
                              <span>{resource.format}</span>
                            </div>
                            <div className="d-flex justify-content-between small">
                              <span>Access:</span>
                              <Badge bg={resource.access_level === 'all_students' ? 'success' : 'warning'}>
                                {resource.access_level.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>

                          <div className="d-grid">
                            <Button
                              variant="primary"
                              onClick={() => accessDigitalResource(resource)}
                            >
                              <i className="fas fa-external-link-alt me-2"></i>
                              Access Resource
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="history" title={
          <span>
            <i className="fas fa-clock me-2"></i>
            Reading History ({readingHistory.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                My Reading History & Progress
              </h5>
            </Card.Header>
            <Card.Body>
              {readingHistory.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No reading history available. Start reading to track your progress!
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead className="table-dark">
                    <tr>
                      <th>Book Details</th>
                      <th>Category</th>
                      <th>Last Read</th>
                      <th>Reading Progress</th>
                      <th>Reading Time</th>
                      <th>Notes & Bookmarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {readingHistory.map((history) => (
                      <tr key={history.book_id}>
                        <td>
                          <div className="fw-bold">{history.title}</div>
                          <small className="text-muted">{history.author}</small>
                        </td>
                        <td>
                          <Badge bg="info">{history.category}</Badge>
                        </td>
                        <td>{new Date(history.last_read).toLocaleDateString()}</td>
                        <td>
                          <div className="mb-1">
                            <ProgressBar
                              now={history.reading_progress}
                              label={`${history.reading_progress}%`}
                              variant={history.reading_progress === 100 ? 'success' : 'primary'}
                            />
                          </div>
                          <small className="text-muted">
                            {history.pages_read}/{history.total_pages} pages
                          </small>
                        </td>
                        <td>
                          <div className="fw-bold">{history.reading_time}</div>
                          <small className="text-muted">Total time</small>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Badge bg="warning">
                              <i className="fas fa-sticky-note me-1"></i>
                              {history.notes_count}
                            </Badge>
                            <Badge bg="info">
                              <i className="fas fa-bookmark me-1"></i>
                              {history.bookmarks}
                            </Badge>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="recommendations" title={
          <span>
            <i className="fas fa-star me-2"></i>
            Recommendations ({recommendations.length})
          </span>
        }>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="fas fa-star me-2"></i>
                Personalized Book Recommendations
              </h5>
            </Card.Header>
            <Card.Body>
              {recommendations.length === 0 ? (
                <Alert variant="info">
                  <i className="fas fa-info-circle me-2"></i>
                  No recommendations available. Read more books to get personalized suggestions!
                </Alert>
              ) : (
                <Row>
                  {recommendations.map((book) => (
                    <Col md={6} lg={4} key={book.book_id} className="mb-4">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Header className="bg-gradient-primary text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <Badge bg="light" text="dark">
                              {book.recommendation_score}% Match
                            </Badge>
                            <div className="text-warning">
                              <i className="fas fa-star"></i> {book.rating}
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body>
                          <h6 className="fw-bold mb-2">{book.title}</h6>
                          <p className="text-muted small mb-2">{book.author}</p>
                          <Badge bg="info" className="mb-3">{book.category}</Badge>
                          
                          <div className="mb-3">
                            <small className="text-muted">
                              <i className="fas fa-lightbulb me-1"></i>
                              {book.reason}
                            </small>
                          </div>

                          <div className="mb-3">
                            <Badge bg={book.availability === 'available' ? 'success' : 'warning'}>
                              {book.availability === 'available' ? 'Available Now' : 'Limited Copies'}
                            </Badge>
                          </div>

                          <div className="d-grid gap-2">
                            <Button variant="primary" size="sm">
                              <i className="fas fa-info-circle me-1"></i>
                              View Details
                            </Button>
                            <Button variant="outline-success" size="sm">
                              <i className="fas fa-book me-1"></i>
                              Add to Wishlist
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Issue Book Modal */}
      <Modal show={showIssueModal} onHide={() => setShowIssueModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-book me-2"></i>
            Issue Book
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <div>
              <h6>Book Details:</h6>
              <div className="mb-3 p-3 bg-light rounded">
                <div className="fw-bold">{selectedBook.title}</div>
                <div className="text-muted">{selectedBook.author}</div>
                <div className="small">ISBN: {selectedBook.isbn}</div>
                <div className="small">Location: {selectedBook.location}</div>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Available Copies:</span>
                  <Badge bg="success">{selectedBook.available_copies}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Issue Period:</span>
                  <span>30 days</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Due Date:</span>
                  <span>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Library Policy:</strong>
                <ul className="mb-0 mt-2">
                  <li>Books can be renewed up to 2 times</li>
                  <li>Late return fine: ₹5 per day</li>
                  <li>Maximum issue period: 45 days (with renewals)</li>
                  <li>Lost book replacement cost will be charged</li>
                </ul>
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIssueModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmIssueBook}>
            <i className="fas fa-check me-2"></i>
            Confirm Issue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Book Details Modal */}
      <Modal show={showBookDetailsModal} onHide={() => setShowBookDetailsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-info-circle me-2"></i>
            Book Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBook && (
            <div>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <img
                      src={selectedBook.cover_image || '/images/books/default.jpg'}
                      alt={selectedBook.title}
                      className="img-fluid rounded shadow"
                      style={{ maxHeight: '300px' }}
                    />
                    <div className="mt-3">
                      <div className="text-warning mb-2">
                        <i className="fas fa-star"></i> {selectedBook.rating}
                        <small className="text-muted ms-2">({selectedBook.reviews_count} reviews)</small>
                      </div>
                      {selectedBook.popular && (
                        <Badge bg="warning" className="mb-2">
                          <i className="fas fa-fire me-1"></i>
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                </Col>
                <Col md={8}>
                  <h4 className="mb-3">{selectedBook.title}</h4>
                  <h6 className="text-muted mb-3">{selectedBook.author}</h6>
                  
                  <p className="mb-4">{selectedBook.description}</p>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <div className="mb-2">
                        <strong>Publisher:</strong> {selectedBook.publisher}
                      </div>
                      <div className="mb-2">
                        <strong>Edition:</strong> {selectedBook.edition}
                      </div>
                      <div className="mb-2">
                        <strong>Year:</strong> {selectedBook.publication_year}
                      </div>
                      <div className="mb-2">
                        <strong>Pages:</strong> {selectedBook.pages}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-2">
                        <strong>Language:</strong> {selectedBook.language}
                      </div>
                      <div className="mb-2">
                        <strong>Category:</strong> {selectedBook.category}
                      </div>
                      <div className="mb-2">
                        <strong>Subcategory:</strong> {selectedBook.subcategory}
                      </div>
                      <div className="mb-2">
                        <strong>Location:</strong> {selectedBook.location}
                      </div>
                    </Col>
                  </Row>

                  <div className="mb-3">
                    <strong>Availability:</strong>
                    <Badge bg={getAvailabilityColor(selectedBook.available_copies, selectedBook.total_copies)} className="ms-2">
                      {selectedBook.available_copies}/{selectedBook.total_copies} copies available
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <strong>Tags:</strong>
                    <div className="mt-1">
                      {selectedBook.tags?.map((tag, index) => (
                        <Badge key={index} bg="outline-secondary" className="me-1 mb-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => {
                        setShowBookDetailsModal(false);
                        issueBook(selectedBook);
                      }}
                      disabled={selectedBook.available_copies === 0}
                    >
                      <i className="fas fa-book me-2"></i>
                      Issue Book
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      onClick={() => {
                        setShowBookDetailsModal(false);
                        reserveBook(selectedBook);
                      }}
                      disabled={selectedBook.available_copies > 0}
                    >
                      <i className="fas fa-calendar-plus me-2"></i>
                      Reserve Book
                    </Button>
                    {selectedBook.digital_available && (
                      <Button variant="outline-info">
                        <i className="fas fa-laptop me-2"></i>
                        Digital Version
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Library;
