import { postInstance } from "../instance";
import axios from "axios";

export const createPost = async (post) => {
    try {
        const res = await postInstance.post("/", post);
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getPostByTitle = async (title) => {
    try {
        const res = await postInstance.get(`?${title}`);
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
};

export const getPosts = async (page, size) => {
    try {
        const res = await postInstance.get(`/getAll?page=${page}&size=${size}`);
        return res.data;
    } catch (err) {
        return Promise.reject(err);
    }
};
