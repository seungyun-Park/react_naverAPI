import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PostTable from '../components/PostTable';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Pagination from '../components/Pagination';
import axios from 'axios';

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 10vh;
  background-color: rgb(140,3,39);
  padding: 40px;
`;

const Title = styled.div`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 45px;
  font-weight: 550;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #ffffff;
`;

const RedLine = styled.div`
  width: 85%;
  text-align: center;
  border-bottom: 4px solid rgb(140,3,39);
  line-height: 0.2em;
  margin: 30px auto 15px;
`;

const Line = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 4px solid #D6CDBE;
  line-height: 0.2em;
  margin: 15px 0 15px;
`;

const Wrapper = styled.div`
  padding: 10px;
  width: 80%;
  display: flex;
  margin: auto;
  justify-content: space-between;
`;

const SearchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SearchButton = styled.button`
font-size: 18px;
  margin-left: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #8C0327;
  color: #fff;
  cursor: pointer;
`;

function ComplainPage(){
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [clickSearch, setClickSearch] = useState(false);

  const postsPerPage = 10;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const fetchPosts = async (keyword = '', board = 'complain', page = 1) => {
    try {
      const endpoint = keyword ? 'search' : 'complain';
      const response = await axios.get(`https://udr.wild2.duckdns.org/board/${endpoint}`, {
        params: {
          query: keyword,
          page: page,
          category: board
        }
      });
      
      setPosts(response.data.posts);
      setTotalPosts(response.data.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    if (clickSearch) {
      fetchPosts(searchKeyword, 'complain', currentPage);
    } else {
      fetchPosts('', 'complain', currentPage);
    }
  }, [currentPage, clickSearch]);

  const handleSearch = () => {
    setCurrentPage(1);
    setClickSearch(true);
    fetchPosts(searchKeyword, 'complain', 1);
  };

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      handleSearch();
    }
  }

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <>
      <Header />
      <TitleContainer>
        <Line />
          <Title>민원 게시판</Title>
        <Line />
      </TitleContainer>
      <RedLine/>
      <Wrapper>
        <Button
          title="글쓰기"
          onClick={() => {
            navigate('/post-write?board=complain');
          }}
        />
        <SearchWrapper>
          <input
            placeholder="검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => activeEnter(e)}
          />
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchWrapper>
      </Wrapper>
      <PostTable postwhat={posts} currentPage={currentPage} postsPerPage={postsPerPage} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </>
  );
}

export default ComplainPage;