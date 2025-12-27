export default function EmptyState({
  message,
  searchQuery,
  notFoundMessage = "Aucun élément trouvé",
  emptyMessage = "Aucun élément disponible"
}) {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="font-poppins text-xl text-gray-500">
        {message || (searchQuery ? notFoundMessage : emptyMessage)}
      </p>
    </div>
  );
}
