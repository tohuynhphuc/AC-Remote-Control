// * Import
import sqlite from 'better-sqlite3';

export interface DatabaseToken {
	userID: string;
	expiresAt: number;
	tokenHash: string;
}

export const db = sqlite('main.db');

db.exec(`CREATE TABLE IF NOT EXISTS user (
	id TEXT NOT NULL PRIMARY KEY,
	username TEXT NOT NULL UNIQUE,
	password TEXT NOT NULL
)`);

db.exec(`CREATE TABLE IF NOT EXISTS session (
 	id TEXT NOT NULL PRIMARY KEY,
 	expires_at INTEGER NOT NULL,
 	user_id TEXT NOT NULL,
 	FOREIGN KEY (user_id) REFERENCES user(id)
)`);

db.exec(`CREATE TABLE IF NOT EXISTS token (
	userID TEXT NOT NULL,
	expiresAt INTEGER NOT NULL,
	tokenHash TEXT NOT NULL,
	FOREIGN KEY (userID) REFERENCES user(id)
)`);
