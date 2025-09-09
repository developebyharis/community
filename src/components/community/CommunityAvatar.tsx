function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function CommunityAvatar({ name }: { name: string }) {
  const bgColor = stringToColor(name);
  const initials = getInitials(name);

  return (
    <div
      className="w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
