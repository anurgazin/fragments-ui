// src/api.js

// fragments microservice API
const apiUrl = process.env.API_URL;

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function postFragments(user, type, content) {
  console.log("Post fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${type}`,
      },
      body: `${content}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Post user fragments data", { data });
  } catch (err) {
    console.error("Unable to call POST /fragment", { err });
  }
}

export async function putFragment(user, id, type, content) {
  console.log("Put fragments data...");
  try {
    console.log(type);
    console.log(content);
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${type}`,
      },
      body: `${content}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Put user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call Put /fragment", { err });
  }
}

export async function deleteFragment(user, id) {
  console.log("Delete fragment");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const ret = await res.json();
    console.log("Delete fragments data", { ret });
    return ret;
  } catch (err) {
    console.error("Unable to call DELETE /fragment", { err });
  }
}

export async function getFragment(user, id) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const headers = res.headers.get("content-type");
    var data;
    console.log("CONTENT_TYPE", headers);
    if (headers.includes("text/plain")) {
      data = await res.text();
    } else if (headers.includes("application/json")) {
      data = await res.text();
    } else if (headers.includes("text/html")) {
      data = await res.text();
    } else if (headers.includes("image/")){
      data = await res.blob();
    }else{
      data = await res.text();
    }
      console.log("Got user fragments data", { data });
      return[headers, data];
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getFragmentMeta(user, id) {
  console.log("Requesting user fragments data...");
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        // Include the user's ID Token in the request so we're authorized
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("Got user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}
