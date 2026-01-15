import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function InstallButton() {
  const install = () => {
    window.location.href = `${process.env.REACT_APP_API_URL || "https://slack-schedular-1.onrender.com"}/auth/install`;
  };
  return (
    <Stack direction="row" justifyContent="center" sx={{ my: 2 }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<CloudDownloadIcon />}
        onClick={install}
        sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 18 }}
      >
        Install / Connect Slack
      </Button>
    </Stack>
  );
}

