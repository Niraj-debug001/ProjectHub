
// src/components/dashboard/EmailReportWidget.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Send, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { Mission } from '@/types';
import { generateProgressEmail, type GenerateProgressEmailOutput } from '@/ai/flows/generate-progress-email-flow';
import { useAuth } from '@/hooks/useAuth';

interface EmailReportWidgetProps {
  activeMission: Mission | undefined;
}

export function EmailReportWidget({ activeMission }: EmailReportWidgetProps) {
  const [recipientEmail, setRecipientEmail] = useState('admin@missioncontrol.com');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GenerateProgressEmailOutput | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const handleGenerateEmail = async () => {
    if (!activeMission) {
      toast({ title: "No Active Mission", description: "Please select or ensure there is an active mission.", variant: "destructive" });
      return;
    }
    if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
      toast({ title: "Invalid Email", description: "Please enter a valid recipient email address.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setGeneratedEmail(null);

    try {
      const pendingTasks = activeMission.tasks
        .filter(task => !task.completed)
        .map(task => ({ 
          name: task.name,
          dueDate: task.dueDate // Pass the dueDate
        }));
      const completedTasksCount = activeMission.tasks.filter(task => task.completed).length;
      const totalTasksCount = activeMission.tasks.length;
      const overallProgressPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

      const result = await generateProgressEmail({
        userName: currentUser?.name || "Team Member",
        missionName: activeMission.name,
        pendingTasks,
        completedTasksCount,
        totalTasksCount,
        overallProgressPercentage,
      });
      setGeneratedEmail(result);
      setIsDialogOpen(true);
      toast({ title: "Email Content Generated", description: "Review the email content below. (Simulated Send)" });
    } catch (e) {
      console.error("Email Generation Error:", e);
      toast({ title: "Error", description: "Failed to generate email content. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Send Progress Update</CardTitle>
          </div>
          <CardDescription>Generate and (simulate) send an email with mission progress and task reminders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recipientEmail">Recipient Email</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="Enter recipient's email"
              className="bg-background"
              disabled={!activeMission || isLoading}
            />
          </div>
          <Button onClick={handleGenerateEmail} disabled={isLoading || !activeMission} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Generating...' : 'Generate & Send Email'}
          </Button>
          {!activeMission && (
            <p className="text-xs text-muted-foreground text-center">An active mission is required to send a report.</p>
          )}
        </CardContent>
      </Card>

      {generatedEmail && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" />Generated Email Content</DialogTitle>
              <DialogDescription>
                This is a simulation. The email below would be sent to {recipientEmail}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label className="font-semibold">Subject:</Label>
                <p className="text-sm p-2 bg-secondary/50 rounded-md">{generatedEmail.emailSubject}</p>
              </div>
              <div>
                <Label className="font-semibold">Body:</Label>
                <pre className="text-sm p-2 bg-secondary/50 rounded-md whitespace-pre-wrap font-sans">{generatedEmail.emailBody}</pre>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
