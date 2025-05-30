import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function HowToPlay({ onClose }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>HOW TO PLAY?</AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>How to Play</AlertDialogTitle>
          <AlertDialogDescription>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Click "Start Game" to begin the timer</li>
              <li>Look carefully at both images to spot the differences</li>
              <li>Click on any difference you find in either image</li>
              <li>Found differences will be highlighted with green circles</li>
              <li>Find all differences to complete the game</li>
              <li>Try to complete it as quickly as possible!</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default HowToPlay;
