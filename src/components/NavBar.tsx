"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Breadcrumbs,
  Link,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  Dashboard as DashboardIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme as useCustomTheme } from "@/contexts/ThemeContext";

const navItems = [{ label: "Dashboard", path: "/", icon: <DashboardIcon /> }];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const router = useRouter();
  const pathname = usePathname();
  const { toggleTheme, theme } = useCustomTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];

    // Always add home
    breadcrumbs.push({
      label: "Home",
      path: "/",
      icon: <HomeIcon fontSize="small" />,
    });

    // Add current page based on pathname
    if (pathname === "/") {
      breadcrumbs.push({
        label: "Dashboard",
        path: "/",
        icon: <DashboardIcon fontSize="small" />,
      });
    } else if (pathname.startsWith("/tasks/")) {
      breadcrumbs.push({
        label: "Task Details",
        path: pathname,
        icon: <DashboardIcon fontSize="small" />,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Kanban App
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.08)",
                },
              }}
            >
              <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
                {item.icon}
              </Box>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: (theme) =>
            theme.palette.mode === "dark"
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left side - Menu and Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "inherit" : "text.primary",
                }}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Typography
              variant={isMobile ? "h6" : "h5"}
              component="h1"
              sx={{
                fontWeight: 700,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation("/")}
            >
              Kanban App
            </Typography>
          </Box>

          {/* Right side - Navigation and Theme Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, mr: 2 }}>
                {navItems.map((item) => (
                  <IconButton
                    key={item.label}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color:
                        pathname === item.path
                          ? "primary.main"
                          : "text.secondary",
                      "&:hover": {
                        background: (theme) =>
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.08)",
                      },
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ))}
              </Box>
            )}

            {/* Breadcrumbs for Desktop */}
            {!isMobile && breadcrumbs.length > 1 && (
              <Breadcrumbs
                sx={{
                  mr: 2,
                  "& .MuiBreadcrumbs-separator": {
                    color: "text.secondary",
                  },
                }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <Link
                    key={crumb.path}
                    color={
                      index === breadcrumbs.length - 1
                        ? "text.primary"
                        : "text.secondary"
                    }
                    underline="hover"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                    onClick={() => handleNavigation(crumb.path)}
                  >
                    {crumb.icon}
                    {crumb.label}
                  </Link>
                ))}
              </Breadcrumbs>
            )}

            {/* Theme Toggle */}
            <IconButton
              onClick={toggleTheme}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(0,0,0,0.08)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {theme === "dark" ? <LightIcon /> : <DarkIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
                : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
            backdropFilter: "blur(20px)",
            borderRight: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
}
