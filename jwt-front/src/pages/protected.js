import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Protected() {
    const [data, setData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/api/protected', { withCredentials: true });
                setData(response.data);
            } catch (err) {
                alert('Access denied');
            }
        };
        fetchData();
    }, []);

    async function handleLogout() {
        try {
            await axios.post('http://localhost:5001/api/logout', {}, { withCredentials: true });
            router.push('/login');
        } catch (error) {
            alert('Could not logout');
        }
    }

    if (!data) return <p>Loading...</p>;

    return <div>
        {JSON.stringify(data)}
        <button onClick={handleLogout}>Logout</button>
    </div>;
}