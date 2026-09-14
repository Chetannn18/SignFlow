import { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';
import { Button } from '@documenso/ui/primitives/button';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { CheckCircle2, FileText, TimerOff, UploadCloud, XCircle } from 'lucide-react';
import { match } from 'ts-pattern';

import { useEnvelopeDropZone } from '~/components/general/envelope/envelope-drop-zone-wrapper';

export type DocumentsTableEmptyStateProps = { status: ExtendedDocumentStatus };

export const DocumentsTableEmptyState = ({ status }: DocumentsTableEmptyStateProps) => {
  const { _ } = useLingui();
  const { open: openUpload } = useEnvelopeDropZone();

  const {
    title,
    message,
    icon: Icon,
    showUploadAction,
  } = match(status)
    .with(ExtendedDocumentStatus.COMPLETED, () => ({
      title: msg`No completed documents yet`,
      message: msg`Documents that you send or receive will appear here once all signatures are collected.`,
      icon: CheckCircle2,
      showUploadAction: false,
    }))
    .with(ExtendedDocumentStatus.DRAFT, () => ({
      title: msg`No active drafts`,
      message: msg`Upload a PDF document to begin adding signature fields, recipients, and custom settings.`,
      icon: FileText,
      showUploadAction: true,
    }))
    .with(ExtendedDocumentStatus.CANCELLED, () => ({
      title: msg`No cancelled documents`,
      message: msg`Cancelled documents will remain archived here for audit trail compliance.`,
      icon: XCircle,
      showUploadAction: false,
    }))
    .with(ExtendedDocumentStatus.REJECTED, () => ({
      title: msg`No rejected documents`,
      message: msg`Documents declined by any signer will appear here with signer feedback.`,
      icon: XCircle,
      showUploadAction: false,
    }))
    .with(ExtendedDocumentStatus.EXPIRED, () => ({
      title: msg`No expired documents`,
      message: msg`Documents with expired signing deadlines will be cataloged here.`,
      icon: TimerOff,
      showUploadAction: false,
    }))
    .with(ExtendedDocumentStatus.ALL, () => ({
      title: msg`Welcome to SignFlow`,
      message: msg`You haven't uploaded any documents yet. Create your first document to experience effortless digital signing.`,
      icon: UploadCloud,
      showUploadAction: true,
    }))
    .otherwise(() => ({
      title: msg`All caught up`,
      message: msg`All documents in this view have been processed. New activity will display here automatically.`,
      icon: CheckCircle2,
      showUploadAction: false,
    }));

  return (
    <div
      className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-border/60 border-dashed bg-card/40 p-8 text-center"
      data-testid="empty-document-state"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <div className="mt-4 max-w-[50ch]">
        <h3 className="font-semibold text-foreground text-lg">{_(title)}</h3>
        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{_(message)}</p>
      </div>

      {showUploadAction && (
        <div className="mt-6 flex flex-col items-center gap-y-2">
          <Button type="button" onClick={openUpload} className="gap-2 shadow-sm">
            <UploadCloud className="h-4 w-4" />
            <Trans>Upload & Sign Document</Trans>
          </Button>
          <p className="text-muted-foreground/60 text-xs">or drag and drop a PDF anywhere on this page</p>
        </div>
      )}
    </div>
  );
};
