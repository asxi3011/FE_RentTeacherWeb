import React, { useState } from "react";
import { Box, Typography, TextField, Button, Paper, Avatar, Drawer, List, ListItem, ListItemText, ListItemAvatar, Divider } from "@mui/material";

import { styled } from "@mui/material/styles";


const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%"
}));

const ChatContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    height: "100vh",
    backgroundColor: theme.palette.background.default
}));

const ChatContent = styled(Box)(({ theme }) => ({
    flex: 1,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column"
}));

const MessageList = styled(Box)(({ theme }) => ({
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2)
}));

const MessageInput = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`
}));

const Chat = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [message, setMessage] = useState("");

    const chatList = [
        { id: 1, name: "John Doe", lastMessage: "Hey, how are you?" },
        { id: 2, name: "Jane Smith", lastMessage: "Can we meet tomorrow?" },
        { id: 3, name: "Mike Johnson", lastMessage: "Thanks for your help!" }
    ];

    const messages = [
        { id: 1, sender: "John Doe", text: "Hey, how are you?", time: "10:00 AM" },
        { id: 2, sender: "You", text: "I'm good, thanks!", time: "10:05 AM" },
    ];

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            console.log("Message sent:", message);
            setMessage("");
        }
    };

    return (

        <ChatContainer>
            <Drawer
                variant="permanent"
                sx={{
                    width: 320,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: 320,
                        boxSizing: "border-box"
                    }
                }}
            >
                <Box sx={{ overflow: "auto", mt: 8 }}>
                    <Typography variant="h6" sx={{ p: 2 }}>
                        Chats
                    </Typography>
                    <Divider />
                    <List>
                        {chatList.map((chat) => (
                            <ListItem
                                key={chat.id}
                                button
                                selected={selectedChat === chat.id}
                                onClick={() => setSelectedChat(chat.id)}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FiUser />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={chat.name}
                                    secondary={chat.lastMessage}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <ChatContent>
                {selectedChat ? (
                    <>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {chatList.find(chat => chat.id === selectedChat)?.name}
                        </Typography>
                        <MessageList>
                            {messages.map((msg) => (
                                <Box
                                    key={msg.id}
                                    sx={{
                                        display: "flex",
                                        justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
                                        mb: 2
                                    }}
                                >
                                    <Paper
                                        sx={{
                                            p: 2,
                                            backgroundColor: msg.sender === "You" ? "primary.main" : "grey.100",
                                            color: msg.sender === "You" ? "white" : "text.primary",
                                            maxWidth: "70%"
                                        }}
                                    >
                                        <Typography variant="body1">{msg.text}</Typography>
                                        <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
                                            {msg.time}
                                        </Typography>
                                    </Paper>
                                </Box>
                            ))}
                        </MessageList>
                        <MessageInput component="form" onSubmit={handleSendMessage}>
                            <TextField
                                fullWidth
                                placeholder="Type a message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variant="outlined"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<FiSend />}
                            >
                                Send
                            </Button>
                        </MessageInput>
                    </>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            height: "100%"
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Select a chat to start messaging
                        </Typography>
                    </Box>
                )}
            </ChatContent>
        </ChatContainer>

    );
};

export default Chat;