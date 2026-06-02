import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';
import { getTours, deleteTour } from '@/services/tourService';

interface Tour {
  id: number;
  tour_title: string;
  slug: string;
  country: string;
  city: string;
  duration_days: number;
  status: string;
  created_at: string;
}

export default function ToursIndex() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTours(
          currentPage,
          itemsPerPage,
          filterStatus || undefined,
          searchTerm || undefined
        );

        if (response.success) {
          setTours(response.data.data || []);
        } else {
          setError(response.message || 'Failed to fetch tours');
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching tours');
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentPage, filterStatus, searchTerm]);

  const filteredTours = tours.filter(tour => {
    const matchesSearch = tour.tour_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tour.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === '' || tour.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  const handleDeleteTour = async (tourId: number) => {
    try {
      await deleteTour(tourId);
      setTours(tours.filter(tour => tour.id !== tourId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete tour');
    }
  };

  return (
    <ProtectedRoute>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="fa fa-exclamation-circle me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}

        <div className="page-title mb-4">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li><h1>Tours</h1></li>
              <li className="breadcrumb-item">
                <a href="/dashboard">
                  <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.125 6.375L8.5 1.41667L14.875 6.375V14.1667C14.875 14.5424 14.7257 14.9027 14.4601 15.1684C14.1944 15.4341 13.8341 15.5833 13.4583 15.5833H3.54167C3.16594 15.5833 2.80561 15.4341 2.53993 15.1684C2.27426 14.9027 2.125 14.5424 2.125 14.1667V6.375Z" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M6.375 15.5833V8.5H10.625V15.5833" stroke="var(--bs-body-color)" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Home
                </a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">Tours</li>
            </ol>
          </nav>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-header border-0 d-flex align-items-center justify-content-between">
                <h5 className="card-title mb-0">All Tours</h5>
                <a href="/admin/tours/create" className="btn btn-primary btn-sm">
                  <i className="fa-solid fa-plus me-1"></i> Add New Tour
                </a>
              </div>

              {/* Search and Filter */}
              <div className="card-body pb-0">
                <div className="row g-3">
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search tours..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>

                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tours Table */}
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : paginatedTours.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#999' }}>
                  <i className="fa fa-inbox" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}></i>
                  <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                    {searchTerm || filterStatus ? 'No tours found matching your criteria.' : 'No tours yet. Create your first tour to get started.'}
                  </p>
                  {!searchTerm && !filterStatus && (
                    <a href="/admin/tours/create" className="btn btn-primary btn-sm">
                      <i className="fa-solid fa-plus me-1"></i> Create Tour
                    </a>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-3">#</th>
                        <th>Title</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th className="text-end pe-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTours.map((tour, index) => (
                        <tr key={tour.id}>
                          <td className="ps-3">
                            <span style={{ fontSize: '12px', color: '#999', fontWeight: 600 }}>
                              #{(currentPage - 1) * itemsPerPage + index + 1}
                            </span>
                          </td>
                          <td>
                            <div>
                              <h6 style={{ marginBottom: '4px', fontSize: '13px', fontWeight: 600 }}>{tour.tour_title}</h6>
                              <small style={{ color: '#999' }}>{tour.slug}</small>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '13px' }}>{tour.country}, {tour.city}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{tour.duration_days} Days</span>
                          </td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                background: tour.status === 'active' ? '#28a745' : tour.status === 'draft' ? '#ffc107' : '#6c757d',
                                color: tour.status === 'draft' ? '#000' : '#fff',
                                fontSize: '11px',
                              }}
                            >
                              {tour.status.charAt(0).toUpperCase() + tour.status.slice(1)}
                            </span>
                          </td>
                          <td>
                            <small style={{ color: '#999' }}>
                              {new Date(tour.created_at).toLocaleDateString()}
                            </small>
                          </td>
                          <td className="text-end pe-3">
                            <div className="d-flex gap-2 justify-content-end">
                              <a
                                href={`/admin/tours/${tour.id}/edit`}
                                className="btn btn-warning btn-xs light"
                                title="Edit"
                              >
                                <i className="fa-solid fa-pen"></i>
                              </a>
                              <a
                                href={`/admin/tours/${tour.id}`}
                                className="btn btn-info btn-xs light"
                                title="View"
                              >
                                <i className="fa-solid fa-eye"></i>
                              </a>
                              <button
                                className="btn btn-danger btn-xs light"
                                title="Delete"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this tour?')) {
                                    handleDeleteTour(tour.id);
                                  }
                                }}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="card-footer border-0 d-flex justify-content-between align-items-center">
                  <small style={{ color: '#999' }}>
                    Showing {paginatedTours.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTours.length)} of {filteredTours.length} tours
                  </small>
                  <nav>
                    <ul className="pagination mb-0" style={{ gap: '4px' }}>
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }).map((_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
    </ProtectedRoute>
  );
}
