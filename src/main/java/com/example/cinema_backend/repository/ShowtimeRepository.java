package com.example.cinema_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.cinema_backend.model.Showtime;

public interface ShowtimeRepository extends MongoRepository<Showtime, String> {

    List<Showtime> findByRoomName(String roomName);

}