// frontend/src/components/UnionList.js
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function UnionList({ unions }) {
  if (!unions || unions.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary">
        No unions found.
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Typography variant="h6" gutterBottom>
        Search Results ({unions.length})
      </Typography>
      <List>
        {unions.map((union) => (
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
                      Type: {union.type}
                    </Typography>
                    {union.site && (
                      <Typography variant="body2" color="textSecondary">
                        <LocationOnIcon fontSize="small" /> {union.city},{" "}
                        {union.state} {union.zip}
                      </Typography>
                    )}
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
    </Paper>
  );
}

export default UnionList;
