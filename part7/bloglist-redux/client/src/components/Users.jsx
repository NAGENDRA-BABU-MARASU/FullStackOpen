import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  HeaderSubheader,
  HeaderContent,
  TableRow,
  TableHeaderCell,
  TableHeader,
  TableCell,
  TableBody,
  Header,
  Table,
} from "semantic-ui-react";

const Users = ({ usersInfo }) => {
  if (!usersInfo) {
    return <div>...loading</div>;
  }

  return (
    <div>
      <Header as="h2" textAlign="center">
        Users
      </Header>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderCell></TableHeaderCell>
            <TableHeaderCell>blogs created</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersInfo.map((userInfo) => (
            <TableRow key={userInfo.username}>
              <TableCell>
                <Link to={`/users/${userInfo.id}`}>{userInfo.username}</Link>
              </TableCell>

              <td>{userInfo.blogs.length}</td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Users;
