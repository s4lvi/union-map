// frontend/src/components/UnionList.js
import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  IconButton,
  Typography,
  Paper,
  Divider,
  Box,
  Pagination,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// Define the number of items per page
const ITEMS_PER_PAGE = 5;

function UnionList({ unions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate total pages
  const totalPages = Math.ceil(unions.length / ITEMS_PER_PAGE);

  // Handle page change
  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  // Determine the unions to display on the current page
  const indexOfLastUnion = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUnion = indexOfLastUnion - ITEMS_PER_PAGE;
  const currentUnions = unions.slice(indexOfFirstUnion, indexOfLastUnion);

  if (!unions || unions.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No unions found.
      </Typography>
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Search Results ({unions.length})
        </Typography>
        <IconButton
          onClick={toggleExpand}
          aria-label={isExpanded ? "Collapse" : "Expand"}
        >
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={isExpanded}>
        <List>
          {currentUnions.map((union) => (
            <React.Fragment key={union._id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {union.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="textSecondary">
                        Type: {union.designation_name}{" "}
                        {union.designation_number}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Sector: {union.sector}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        <LocationOnIcon fontSize="small" /> {union.city},{" "}
                        {union.state} {union.zip}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {union.site && (
                    <IconButton
                      edge="end"
                      aria-label="website"
                      href={
                        union.site.startsWith("http")
                          ? union.site
                          : `http://${union.site}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon />
                    </IconButton>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        )}
      </Collapse>
    </Paper>
  );
}

export default UnionList;
