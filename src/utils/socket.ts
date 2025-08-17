import { io } from "socket.io-client";
import { BACKEND_URL } from "@env";

export const socket = io(BACKEND_URL.replace("/api/v1", ""));
