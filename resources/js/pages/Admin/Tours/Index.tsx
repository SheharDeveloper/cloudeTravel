import { Head, Link } from '@inertiajs/react';
import { ProtectedRoute } from '@/lib/ProtectedRoute';

interface Tour {
    id: number;
    name: string;
    duration: string;
    subtitle: string;
    location?: string;
    price?: number;
}

interface Props {
    tours: Tour[];
}

/**
 * Admin Tours Index - Display all tours
 */
export default function TourIndex({ tours }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            // Delete logic will be added
        }
    };

    return (
        <ProtectedRoute>
            <>
                <Head title="Manage Tours - Admin" />
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#003d82', margin: 0 }}>Manage Tours</h1>
                    <Link href="/admin/tours/create" style={{ background: '#ff6b35', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                        + Add New Tour
                    </Link>
                </div>

                {tours.length === 0 ? (
                    <div style={{ background: '#f9f9f9', padding: '40px', textAlign: 'center', borderRadius: '8px' }}>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>No tours found. Create your first tour!</p>
                        <Link href="/admin/tours/create" style={{ background: '#003d82', color: '#fff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 700, fontSize: '13px' }}>
                            Create Tour
                        </Link>
                    </div>
                ) : (
                    <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 700, color: '#003d82', fontSize: '13px' }}>Tour Name</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 700, color: '#003d82', fontSize: '13px' }}>Duration</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 700, color: '#003d82', fontSize: '13px' }}>Location</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: 700, color: '#003d82', fontSize: '13px' }}>Price</th>
                                    <th style={{ padding: '15px', textAlign: 'center', fontWeight: 700, color: '#003d82', fontSize: '13px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tours.map((tour) => (
                                    <tr key={tour.id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '15px', fontSize: '13px', color: '#333' }}>
                                            <strong>{tour.name}</strong><br />
                                            <span style={{ color: '#999', fontSize: '12px' }}>{tour.subtitle}</span>
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '13px', color: '#333' }}>{tour.duration}</td>
                                        <td style={{ padding: '15px', fontSize: '13px', color: '#333' }}>{tour.location || '-'}</td>
                                        <td style={{ padding: '15px', fontSize: '13px', color: '#ff6b35', fontWeight: 700 }}>£{tour.price || '0'}</td>
                                        <td style={{ padding: '15px', textAlign: 'center', fontSize: '13px' }}>
                                            <Link href={`/admin/tours/${tour.id}/edit`} style={{ color: '#003d82', textDecoration: 'none', marginRight: '10px', fontWeight: 700 }}>
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(tour.id)} style={{ background: 'none', border: 'none', color: '#c0392b', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                </div>
            </>
        </ProtectedRoute>
    );
}
