import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Composer({ teamId, apiBase }: { teamId: string, apiBase: string }) {
  const [channels, setChannels] = useState<any[]>([]);
  const [channel, setChannel] = useState("");
  const [text, setText] = useState("");
  const [postAt, setPostAt] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null, message: string }>({ type: null, message: "" });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${apiBase}/api/channels?teamId=${teamId}`);
        setChannels(res.data.channels || res.data.channels || res.data);
      } catch (err) {
        setFeedback({ type: "error", message: "Failed to load channels." });
      }
    })();
  }, [teamId]);

  const sendNow = async () => {
    setFeedback({ type: null, message: "" });
    try {
      await axios.post(`${apiBase}/api/messages/send`, { teamId, channel, text });
      setFeedback({ type: "success", message: "Message sent (or attempted)." });
    } catch (err: any) {
      setFeedback({ type: "error", message: "Error sending: " + (err?.response?.data?.error || err.message) });
    }
  };

  const schedule = async () => {
    if (!postAt) return setFeedback({ type: "error", message: "Pick a date/time" });
    setFeedback({ type: null, message: "" });
    try {
      await axios.post(`${apiBase}/api/messages/schedule`, { teamId, channel, text, postAt });
      setFeedback({ type: "success", message: "Message scheduled." });
    } catch (err: any) {
      setFeedback({ type: "error", message: "Error scheduling: " + (err?.response?.data?.error || err.message) });
    }
  };

  return (
    <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Compose Message
      </Typography>
      {feedback.type && (
        <Alert severity={feedback.type} sx={{ mb: 2 }}>{feedback.message}</Alert>
      )}
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel id="channel-label">Channel</InputLabel>
          <Select
            labelId="channel-label"
            value={channel || ""}
            label="Channel"
            onChange={(e) => setChannel(e.target.value)}
          >
            <MenuItem value="">--select--</MenuItem>
            {channels.map((c: any) => (
              <MenuItem key={c.id} value={c.id}>{c.name || c.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Message"
          multiline
          minRows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message here..."
          fullWidth
        />
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={sendNow} disabled={!channel || !text}>
            Send Now
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            label="Schedule (local time)"
            type="datetime-local"
            value={postAt}
            onChange={(e) => setPostAt(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 220 }}
          />
          <Button variant="outlined" color="primary" onClick={schedule} disabled={!channel || !text || !postAt}>
            Schedule
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

