import React, { useEffect, useState } from 'react';
import useFetchData from '../../hooks/useFetchData';

function BarProgress(){
    const [progress, setProgress] = useState(0);
    const {loading, error } = useFetchData('/job/list');

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    const diff = 4;
                    return Math.min(oldProgress + diff, 100);
                });
            }, 100);
            return () => {
                clearInterval(interval);
            };
        }
    }, [loading]);

    if (loading) {
        return (
            <div className="loading">
                <h2>Recopilando Datos</h2>
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}>
                        {Math.round(progress)}%
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="error">Error: {error.message}</div>;
    }

}

export default BarProgress;