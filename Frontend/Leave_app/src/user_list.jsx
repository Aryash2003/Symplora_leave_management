import React from "react";


const UserList=({Users})=>{
    return <div>
        <h2>Users</h2>
        <table>
            <thead>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Joining_date</th>
                <th>Leave_balance</th>
            </thead>
            <tbody>
                {Users.map((user)=>(
                    <tr key={user.username}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.department}</td>
                        <td>{user.joining_date}</td>
                        <td>{user.leave_balance}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
}
export default UserList