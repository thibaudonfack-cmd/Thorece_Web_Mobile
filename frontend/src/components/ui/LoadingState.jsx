export default function LoadingState({ message = "Chargement..." }) {
  return (
    <div className="flex items-center justify-center py-20">
      <p className="font-poppins text-xl text-gray-500">{message}</p>
    </div>
  );
}
