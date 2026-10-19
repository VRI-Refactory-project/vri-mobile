// The only place the admin screens talk to the backend.
// Right now it uses SAMPLE data so you can see the screens on your phone.
// Later we replace the two "TODO" parts with real calls (using your api.ts).

export type AdminProfile = {
  full_name: string;
  email: string;
  password_changed_days_ago: number;
};

export type AdminProfileUpdate = {
  full_name: string;
  email: string;
  current_password?: string;
  new_password?: string;
};

// TODO (real version): getJson<AdminProfile>("<ADMIN ENDPOINT>")
export async function loadAdminProfile(): Promise<AdminProfile> {
  return {
    full_name: "Trudy",
    email: "trudy_test@gmail.com",
    password_changed_days_ago: 32,
  };
}

// TODO (real version): send the changes to the backend with PATCH.
export async function saveAdminProfile(
  update: AdminProfileUpdate,
): Promise<AdminProfile> {
  return {
    full_name: update.full_name,
    email: update.email,
    password_changed_days_ago: update.new_password ? 0 : 32,
  };
}
