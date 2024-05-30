import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Header from "../components/Header";
import axios from "axios";

const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Container = styled.div`
    width: 100%;
    max-width: 720px;

    & > * {
        :not(:last-child) {
            margin-bottom: 16px;
        }
    }
`;

function PostWritePage(props) {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const boardType = queryParams.get('board'); //url에서 board타입 추출
    
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(""); // 이미지 파일 상태 추가
    const [needVote, setNeedVote] = useState(false);
    const [voteTitle, setVoteTitle] = useState("투표");

    const token = localStorage.getItem('token');
    const payload = token.split('.')[1];
    const dec = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (c) => c.charCodeAt(0))));

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
        };
    };

    const handlePostSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/board/create", {
                title,
                content,
                category: boardType,
                userid: dec.id,
                needVote: needVote,
                voteTitle,
                image, // Base64 인코딩된 이미지
            }, {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                console.log("Post created successfully");
                navigate(`/${boardType}`);
            } else {
                console.error('Error creating post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    return (
        <>
            <Header />
            <Wrapper>
                <h1>
                    {boardType === 'complain' ? '민원 게시판' :
                    boardType === 'announce' ? '공지사항 게시판' :
                    '제보 게시판'}
                </h1>
                <Container>
                    <TextInput
                        height={20}
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                        }}
                        placeHolder="제목"
                    />

                    <TextInput
                        height={480}
                        value={content}
                        onChange={(event) => {
                            setContent(event.target.value);
                        }}
                        placeHolder="내용을 입력하세요"
                    />
                    <div style={{display: 'flex', flexDirection:'column'}}>
                    <input type="file" onChange={handleImageChange} accept="image/*" multiple />
                    {boardType === "complain" &&
                    <div>
                    <input 
                        type="checkbox" 
                        onChange={(event) => {
                            setNeedVote(event.target.checked);
                        }}/> 투표여부
                    </div>
                    }
                    {needVote && <input 
                                    placeholder="투표제목을 입력하세요"
                                    style={{width: "45%", height: "30px"}}
                                    type="text" 
                                    onChange={(event) => {
                                    setVoteTitle(event.target.value);
                                }}/> }
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            title="글 작성하기"
                            onClick={handlePostSubmit}
                        />
                    </div>
                </Container>
            </Wrapper>
        </>
    );
}

export default PostWritePage;