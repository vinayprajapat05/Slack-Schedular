import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ScheduledList({ teamId, apiBase }: { teamId: string, apiBase: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });

  useEffect(() => { fetchList(); }, [teamId]);
  async function fetchList() {
    try {
      const res = await axios.get(`${apiBase}/api/messages/scheduled?teamId=${teamId}`);
      setItems(res.data);
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to load scheduled messages." });
    }
  }
  async function cancel(id: string) {
    try {
      await axios.post(`${apiBase}/api/messages/scheduled/${id}/cancel`);
      setFeedback({ type: "success", message: "Message cancelled." });
      fetchList();
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to cancel message." });
    }
  }
  return (
    <Box sx={{ mt: 4, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Scheduled Messages
      </Typography>
      {feedback.type && (
        <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>
      )}
      <List>
        {items.length === 0 && (
          <ListItem>
            <ListItemText primary="No scheduled messages." />
          </ListItem>
        )}
        {items.map(it => (
          <ListItem key={it._id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={2} alignItems="center">
                  <span>{new Date(it.postAt).toLocaleString()}</span>
                  <Chip label={it.channel} size="small" color="info" />
                  <span>{it.text}</span>
                  <Chip label={it.status} size="small" color={it.status === "scheduled" ? "success" : "default"} />
                </Stack>
              }
            />
            {it.status === "scheduled" && (
              <Button variant="outlined" color="error" size="small" onClick={() => cancel(it._id)}>
                Cancel
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

