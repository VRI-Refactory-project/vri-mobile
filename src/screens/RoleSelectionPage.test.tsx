import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert } from "react-native";
import { router } from "expo-router";
import RoleSelectionPage from "./RoleSelectionPage";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
    canGoBack: jest.fn(),
  },
}));

// The icons load a font file, which does not exist in tests, so swap them for nothing.
jest.mock("@expo/vector-icons", () => ({
  Feather: () => null,
}));

describe("RoleSelectionPage", () => {
  beforeEach(() => {
    (router.push as jest.Mock).mockClear();
    (router.back as jest.Mock).mockClear();
    (router.replace as jest.Mock).mockClear();
    (router.canGoBack as jest.Mock).mockReturnValue(true);
    jest.spyOn(Alert, "alert").mockImplementation(() => {});
  });

  it("asks who is joining", async () => {
    await render(<RoleSelectionPage />);

    expect(screen.getByRole("header")).toBeOnTheScreen();
    expect(
      screen.getByText(/pick the one that fits you best/i),
    ).toBeOnTheScreen();
  });

  it("shows both roles", async () => {
    await render(<RoleSelectionPage />);

    expect(
      screen.getByRole("button", { name: /deaf or hard of hearing/i }),
    ).toBeOnTheScreen();
    expect(
      screen.getByRole("button", { name: /^interpreter/i }),
    ).toBeOnTheScreen();
  });

  it("goes to the Deaf signup when that role is picked", async () => {
    await render(<RoleSelectionPage />);
    await fireEvent.press(
      screen.getByRole("button", { name: /deaf or hard of hearing/i }),
    );

    expect(router.push).toHaveBeenCalledWith("/signup");
  });

  it("says interpreter registration is coming soon, until that screen exists", async () => {
    await render(<RoleSelectionPage />);
    await fireEvent.press(
      screen.getByRole("button", { name: /^interpreter/i }),
    );

    expect(Alert.alert).toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("goes back when Back is pressed", async () => {
    await render(<RoleSelectionPage />);
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));

    expect(router.back).toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("goes to the landing page when there is nothing to go back to", async () => {
    (router.canGoBack as jest.Mock).mockReturnValue(false);
    await render(<RoleSelectionPage />);
    await fireEvent.press(screen.getByRole("button", { name: "Back" }));

    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).toHaveBeenCalledWith("/landing");
  });
});
