package com.example.cinema_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Creates getters, setters, toString, etc. automatically
@NoArgsConstructor // Creates a no-argument constructor
@AllArgsConstructor // Creates a constructor with all arguments
public class Showtime {

    private String time; // e.g., "2:00 PM"

}