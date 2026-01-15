import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import Composer from "./components/Composer";
import InstallButton from "./components/InstallButton";
import ScheduledList from "./components/ScheduledList";

const API = process.env.REACT_APP_API_URL || "https://slack-schedular-1.onrender.com/";

export default function App() {
  const [teamId, setTeamId] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const team = params.get("team");
    if (team) setTeamId(team);
  }, []);
  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Slack Scheduler
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <InstallButton />
          {teamId ? (
            <>
              <Composer teamId={teamId} apiBase={API} />
              <ScheduledList teamId={teamId} apiBase={API} />
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography color="text.secondary" variant="h6" fontWeight={500}>
                Install the app to your workspace (click Install) and you'll be redirected back here to start scheduling messages.
              </Typography>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
}

