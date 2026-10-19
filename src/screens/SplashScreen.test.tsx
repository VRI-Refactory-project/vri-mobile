import { act, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";
import SplashScreen, { SPLASH_DURATION_MS } from "./SplashScreen";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}));

describe("SplashScreen", () => {
  beforeEach(() => {
    jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    (router.replace as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows only the logo and name", async () => {
    await render(<SplashScreen />);

    expect(screen.getByRole("image", { name: "SignConnect" })).toBeOnTheScreen();
    expect(screen.queryByRole("button")).not.toBeOnTheScreen();
    expect(screen.queryByRole("link")).not.toBeOnTheScreen();
  });

  it("moves on to the landing page by itself", async () => {
    await render(<SplashScreen />);

    expect(router.replace).not.toHaveBeenCalled();
    await act(async () => {
      jest.advanceTimersByTime(SPLASH_DURATION_MS);
    });

    expect(router.replace).toHaveBeenCalledWith("/landing");
  });

  it("does not navigate after it has been closed", async () => {
    const { unmount } = await render(<SplashScreen />);
    await unmount();
    await act(async () => {
      jest.advanceTimersByTime(SPLASH_DURATION_MS);
    });

    expect(router.replace).not.toHaveBeenCalled();
  });
});