import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { FaThumbsUp } from "react-icons/fa6";

const BoardBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 240px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 60px;
  position: relative;
`;

const Title = styled(NavLink)`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 18px;
  font-weight: 550;
  margin-bottom: 10px;
  text-decoration: none;
  color: #000;
`;

const BoardLink = styled(NavLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between; 
  text-decoration: none;
  color: #333;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #7e7e7e;
  line-height: 0.1em;
  margin: 10px 0 10px;
`;

function SummaryBoard({ postwhat, link, title }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`https://udr.wild2.duckdns.org/homepage`, {
          params: { category: postwhat }
        });
        setPosts(response.data.filteredPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <BoardBox>
      <Title to={link}>{title} +</Title>
      <Line/>
      {posts && posts.map(post => (
        <BoardLink key={post.postid} to={`/post/${post.postid}`}>
          <div>{post.title}</div>
          <div style={{color: '#da0a41'}}><FaThumbsUp style={{color: "#da0a41"}}/>{post.recommend}</div>
        </BoardLink>
      ))}
    </BoardBox>
  );
}

export default SummaryBoard;