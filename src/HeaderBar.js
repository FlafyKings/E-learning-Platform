import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import useAuth from "./hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useLogout from "./hooks/useLogout";

const HeaderBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();

  var pages = ["Pulpit", "Grupy", "Dziennik", "Poczta", "Chat"];

  if (auth.roles == 2000) {
    pages = ["Pulpit", "Grupy", "Poczta", "Chat"];
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const openProfile = () => {
    navigate("/profile/" + auth.login);
  };

  const signOut = async () => {
    await logout();
    navigate("/login");
  };

  var dict = {
    Pulpit: "/dashboard",
    Grupy: "/groups",
    Dziennik: "/grades",
    Poczta: "/mail",
    Chat: "/chat",
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#6f87d9" }}>
      <Container maxWidth="none" sx={{ ml: 0.5 }}>
        <Toolbar disableGutters>
          <LocalLibraryIcon
            sx={{ display: { sm: "none", lg: "flex", xs: "none" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 4,
              display: { sm: "none", lg: "flex", xs: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LepszyUPEL
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { sm: "flex", lg: "none", xs: "flex" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { sm: "block", lg: "none", xs: "block" },
              }}
            >
              {/* PHONE MENU*/}
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Button variant="text" href={dict[page]}>
                    {page}
                  </Button>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <LocalLibraryIcon
            sx={{ display: { sm: "flex", lg: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { sm: "flex", lg: "none", xs: "flex" },
              flexGrow: 1,
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LepszyUPEL
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                sm: "none",
                lg: "flex",
                ml: "auto",
                mr: "auto",
                xs: "none",
              },
              justifyContent: "center",
              gap: 10,
            }}
          >
            {/* NORMAL SIZE MENU */}
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                href={dict[page]}
                size="large"
                variant="text"
                sx={{ my: 2, color: "white" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Przejdz do profilu">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, ml: { md: "1rem", xs: "0", lg: "6rem" } }}
              >
                <Avatar sx={{ backgroundColor: "#8fa5f2" }}>
                  {auth.login.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={openProfile}>
                <Button variant="text">Profil</Button>
              </MenuItem>
              <MenuItem onClick={signOut}>
                <Button variant="text">Wyloguj</Button>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default HeaderBar;
