import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup, Input } from 'reactstrap';
import { Table } from 'reactstrap';
import authService from './api-authorization/AuthorizeService'
import block from './icons/block.png';
import unblock from './icons/unlock.png';
import del from './icons/delete.png';
import '../custom.css'

export function Home() {

    const [data, setData] = useState({
        users: []
    });

    var optionsRegisterDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    var optionsLastSignDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };

    useEffect(() => { populateUserData() },[]);
    
    async function populateUserData() {
        const token = await authService.getAccessToken();
        const response = await fetch('user', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setData({ users: data });
        console.log(data);
    };

    async function deleteUserData(dateToDelete) {
        const token = await authService.getAccessToken();
        dateToDelete = JSON.stringify(dateToDelete);
        const response = await fetch('user', {
            method: 'DELETE',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dateToDelete,
        });
        const data = await response.json();
        console.log(data);
    };

    async function lockUserData(dateToLock) {
        const token = await authService.getAccessToken();
        dateToLock = JSON.stringify(dateToLock);
        const response = await fetch('user'+'/lock', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dateToLock,
        });
        const data = await response.json();
        populateUserData();
        console.log(data);
    };

    async function unlockUserData(dateToUnlock) {
        const token = await authService.getAccessToken();
        dateToUnlock = JSON.stringify(dateToUnlock);
        const response = await fetch('user'+'/unlock', {
            method: 'POST',
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: dateToUnlock,
        });
        const data = await response.json();
        populateUserData();
        console.log(data);
    };

    const handleAllChecked = event => {
        let users = data.users;
        users.forEach(user => (user.isChecked = event.target.checked));
        setData({ users: users });
    };

    const handleOnChange = event => {
        let users = data.users;
        users.forEach(user => {
            // eslint-disable-next-line eqeqeq
            if (user.id == event.target.value) {
                user.isChecked = event.target.checked
            }
        });
        setData({ users: users });
    };

    const handleBlock = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        lockUserData(ids);
        setData({ users: users });
    }

    const handleUnlock = () => {
        let users = data.users;
        let ids = [];
        users.forEach(user => {
            if (user.isChecked == true) {
                ids.push(user.id);
            }
        });
        unlockUserData(ids);
        setData({ users: users });
    }

    const handleDelete = () => {
        let users = data.users;
        let ids = [];
        data.users.forEach(function (item, index, object) {
            if (item.isChecked) {
                ids.push(item.id);
                object.splice(index, 1);
            }
        });
        deleteUserData(ids);
        setData({ users: users });
    }

    return (
        <div className="App">
            <ButtonGroup>
                <Button onClick={handleBlock}>
                    <img src={block} alt="block" />
                </Button>
                <Button onClick={handleUnlock}>
                    <img src={unblock} alt="unlock" />
                </Button>
                <Button onClick={handleDelete}>
                    <img src={del} alt="delete" />
                </Button>
            </ButtonGroup>
            <Table>
                <thead>
                    <tr>
                        <th><Input type="checkbox" onChange={handleAllChecked} /> Check All</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Registration Date</th>
                        <th>Last signing</th>
                        <th>Lockout End</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.users.map(user => {
                            return (
                                <tr key={user.id}>
                                    <td><Input type='checkbox' onChange={handleOnChange} checked={user.isChecked} value={user.id} /></td>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.registeringDate).toLocaleString("en-US", optionsRegisterDate)}</td>
                                    <td>{new Date(user.lastSigningDate).toLocaleString("en-US", optionsLastSignDate)}</td>
                                    <td>{new Date(user.lockoutEnd).toLocaleString("en-US", optionsLastSignDate)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
}