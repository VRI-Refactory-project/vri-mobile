import React from "react";
import { Alert } from "react-native";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import AdminSettingsScreen from "./AdminSettingsPage";
import AdminEditProfileScreen from "./AdminEditProfilePage";
import { saveAdminProfile } from "../../services/adminProfile";

const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => {
  const React = require("react");
  return {
    router: {
      push: (...a: unknown[]) => mockPush(...a),
      back: () => mockBack(),
      replace: jest.fn(),
      canGoBack: () => true,
    },
    useFocusEffect: (cb: () => void) => React.useEffect(cb, []),
  };
});

jest.mock("../../services/adminProfile", () => ({
  loadAdminProfile: jest.fn().mockResolvedValue({
    full_name: "Trudy",
    email: "trudy_test@gmail.com",
    password_changed_days_ago: 32,
  }),
  saveAdminProfile: jest.fn().mockResolvedValue({}),
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(Alert, "alert").mockImplementation(() => {});
});

describe("AdminSettingsScreen", () => {
  it("shows the profile, notifications and security sections", async () => {
    await render(<AdminSettingsScreen />);
    expect(await screen.findByText("TRUDY")).toBeOnTheScreen();
    expect(screen.getByText("trudy_test@gmail.com")).toBeOnTheScreen();
    expect(screen.getByText("Session alerts")).toBeOnTheScreen();
    expect(screen.getByText("Last changed 32 days ago")).toBeOnTheScreen();
  });

  it("opens the edit screen from Edit profile", async () => {
    await render(<AdminSettingsScreen />);
    await fireEvent.press(
      await screen.findByRole("button", { name: "Edit profile" }),
    );
    expect(mockPush).toHaveBeenCalledWith("/admin-edit-profile");
  });
});

describe("AdminEditProfileScreen", () => {
  it("fills the form with the current details", async () => {
    await render(<AdminEditProfileScreen />);
    await waitFor(() =>
      expect(screen.getByDisplayValue("Trudy")).toBeOnTheScreen(),
    );
    expect(screen.getByDisplayValue("trudy_test@gmail.com")).toBeOnTheScreen();
  });

  it("saves the changes and goes back", async () => {
    await render(<AdminEditProfileScreen />);
    await waitFor(() => screen.getByDisplayValue("Trudy"));
    await fireEvent.changeText(screen.getByLabelText("Full name"), "Trudy N");
    await fireEvent.press(screen.getByRole("button", { name: "Save changes" }));
    await waitFor(() => expect(mockBack).toHaveBeenCalled());
    expect(saveAdminProfile).toHaveBeenCalledWith(
      expect.objectContaining({ full_name: "Trudy N" }),
    );
  });

  it("asks for the current password before setting a new one", async () => {
    await render(<AdminEditProfileScreen />);
    await waitFor(() => screen.getByDisplayValue("Trudy"));
    await fireEvent.changeText(
      screen.getByLabelText("New password"),
      "secret123",
    );
    await fireEvent.press(screen.getByRole("button", { name: "Save changes" }));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Current password needed",
      expect.any(String),
    );
    expect(saveAdminProfile).not.toHaveBeenCalled();
  });
});
