// Locations used to check data

export const locations = {
  id: "world",
  path: "/world",
  displayName: "World",
  children: [
    {
      id: "cambodia",
      path: "/world/cambodia",
      displayName: "Cambodia",
      children: [
        {
          id: "phnompenh",
          path: "/world/cambodia/phnompenh",
          displayName: "Phnom Penh",
          children: [],
          geometry: { type: "Point", coordinates: [104.921111, 11.569444] },
        },
      ],
    },
    {
      id: "ethiopia",
      path: "/world/ethiopia",
      displayName: "Ethiopia",
      children: [
        {
          id: "addis",
          path: "/world/ethiopia/addis",
          displayName: "Addis Ababa",
          children: [],
          geometry: { type: "Point", coordinates: [38.74, 9.03] },
        },
      ],
    },
    {
      id: "india",
      path: "/world/india",
      displayName: "India",
      children: [
        {
          id: "delhi",
          path: "/world/india/delhi",
          displayName: "Delhi",
          children: [],
          geometry: { type: "Point", coordinates: [77.23, 28.61] },
        },
      ],
    },
    {
      id: "laos",
      path: "/world/laos",
      displayName: "Laos",
      children: [
        {
          id: "vientiane",
          path: "/world/laos/vientiane",
          displayName: "Vientiane",
          children: [],
          geometry: { type: "Point", coordinates: [102.63, 17.98] },
        },
      ],
    },
    {
      id: "malawi",
      path: "/world/malawi",
      displayName: "Malawi",
      children: [
        {
          id: "lilongwe",
          path: "/world/malawi/lilongwe",
          displayName: "Lilongwe",
          children: [],
          geometry: { type: "Point", coordinates: [33.783333, -13.983333] },
        },
      ],
    },
    {
      id: "myanmar",
      path: "/world/myanmar",
      displayName: "Myanmar",
      children: [
        {
          id: "Chauk",
          path: "/world/myanmar/chauk",
          displayName: "Chauk",
          children: [],
          geometry: { type: "Point", coordinates: [94.816667, 20.883333] },
        },
      ],
    },
    {
      id: "nepal",
      path: "/world/nepal",
      displayName: "Nepal",
      children: [
        {
          id: "kathmandu",
          path: "/world/nepal/kathmandu",
          displayName: "Kathmandu",
          children: [],
          geometry: { type: "Point", coordinates: [85.32, 27.71] },
        },
      ],
    },
    {
      id: "norway",
      path: "/world/norway",
      displayName: "Norway",
      children: [
        {
          id: "finse",
          path: "/world/norway/finse",
          displayName: "Finse",
          children: [],
          geometry: { type: "Point", coordinates: [7.502289, 60.602791] },
        },
        {
          id: "oslo",
          path: "/world/norway/oslo",
          displayName: "Oslo",
          children: [],
          geometry: { type: "Point", coordinates: [10.738889, 59.913333] },
        },
      ],
    },
  ],
};

export const findLocation = (id, orgUnit = locations) => {
  if (orgUnit.id === id) {
    return orgUnit;
  } else if (orgUnit.children) {
    let result = null;
    for (let i = 0; result == null && i < orgUnit.children.length; i++) {
      result = findLocation(id, orgUnit.children[i]);
    }
    return result;
  }
  return null;
};
