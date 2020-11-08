import './App.css';
import React, { useEffect, useState } from 'react';
import { ChangeEvent, Post } from './Post';

interface PostContent {
    _id: string;
    userId: number;
    postId: number;
    title: string;
    body: string;
};

const apiUrl = `http://localhost:8080`;

function App() {
    const [posts, setPosts] = useState<PostContent[]>([]);
    const [message, setMessage] = useState<string|null>(null);

    useEffect(() => {
        getPosts();
    }, []);

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                setMessage(null);
            }, 2000);
        }
    }, [message]);

    function getPosts() {
        fetch(`${apiUrl}/posts`)
            .then(response => {
                response.json().then(data => {
                    if (data.success) {
                        setPosts(data.data);
                    }
                });
            }).catch(err => {
                console.log('Fetch Error:', err);
            });
    };

    function onChange({ target }: ChangeEvent, id: string) {
        const postIndex = posts.findIndex(({ _id }) => _id === id);
        const copyPostArray = [...posts];

        copyPostArray[postIndex] = { ...copyPostArray[postIndex], [target.name as 'body' | 'title']: target.value }

        setPosts(copyPostArray);
    }

    function onUpdate(data: object) {
        fetch(`${apiUrl}/post`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(response => {
            response.json().then(data => {
                setMessage(data.success ? 'success' : 'error');
            });
        }).catch(err => {
            console.log('Fetch Error:', err);
            setMessage('error');
        });

    }

    return (
        <div className="app">
            <h2>Posts</h2>
            {message && (
                <p className={message}>{message}</p>
            )}
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>body</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(({ title, body, _id }: PostContent) => (
                        <Post
                            key={_id}
                            title={title}
                            body={body}
                            onUpdate={() => onUpdate({ _id, title, body })}
                            onChange={(event: ChangeEvent) => onChange(event, _id)} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
