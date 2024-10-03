import * as React from 'react';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MDEditor from '@uiw/react-md-editor';

import { neonBlue } from '@/styles/theme/colors';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { apiRoutes, authenticatedPostRequest } from '@/utils/api';
import { downloadStringAsHtmlFile } from '@/utils/download-file';
import { TextField } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'sonner';

import { logger } from '@/lib/default-logger';
import { createClient } from '@/lib/supabase/client';
import Generated from '@/components/documents/generated';
import NotGenerated from '@/components/documents/not-generated';
import Published from '@/components/documents/published';

const supabase = createClient();

function DocumentsDetail({ documents, documentId, setShowDetailView }) {
  const [selectedDocumentId, setSelectedDocumentId] = useState(documentId);
  const [document, setDocument] = useState(null);
  const [value, setValue] = useState('');

  const fetchDocument = async (id) => {
    const { data, error } = await supabase.from('documents').select('*').eq('id', id);
    if (error) {
      logger.error('Error fetching document:', error);
      toast.error('Oepsie');
    } else {
      setDocument(data[0]);
      setValue(data[0].generated_content);
    }
    logger.debug(data);
  };

  useEffect(() => {
    fetchDocument(selectedDocumentId);
  }, [selectedDocumentId]);

  const handleSelectDocument = (id) => {
    setSelectedDocumentId(id);
  };

  const handleClose = () => {
    setShowDetailView(false);
  };

  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingRegenerate, setLoadingRegenerate] = useState(false);
  const [loadingPublish, setLoadingPublish] = useState(false);
  const [loadingArchive, setLoadingArchive] = useState(false);

  useEffect(() => {}, [documents]);

  const handleCLipboard = async () => {
    try {
      await navigator.clipboard.writeText(document.generated_content);
      toast.success('Gekopieerd naar het klembord');
    } catch (err) {
      toast.error('Kopiëren naar het klembord is mislukt');
    }
  };

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      downloadStringAsHtmlFile(document.generated_content, document.document_name);
      toast.success('De productbeschrijving is gedownload');
    } catch (error) {
      toast.error('Download mislukt');
    }
    setLoadingDownload(false);
  };

  const handleRegenerate = async () => {
    setLoadingRegenerate(true);
    const documentNames = [`${document.organization_id}/${document.brand_id}/product/${document.document_name}`];
    toast.info('Regenereren productbeschrijving gestart');

    const response = await authenticatedPostRequest(apiRoutes.events.generate, {
      documents: documentNames,
      background: false,
    });
    if (response.status === 201) {
      fetchDocument(selectedDocumentId);
      toast.success('Productbeschrijving regenereren klaar');
    } else {
      toast.error('Er is iets mis gegaan, probeer het later opnieuw');
    }
    setLoadingRegenerate(false);
  };

  const handlePublish = async () => {
    setLoadingDownload(true);
    toast.success('Productbeschrijving is gepubliceerd');
    setLoadingPublish(false);
  };

  const handleArchive = async () => {
    setLoadingArchive(true);

    const { error } = await supabase.from('documents').update({ is_archived: true }).in('id', [document.id]);

    if (!error) {
      toast.warning('Productbeschrijvingen zijn gearchiveerd');
      setShowDetailView(false);
    } else {
      toast.error('Er is iets mis gegaan, probeer het later opnieuw');
    }
    setLoadingArchive(false);
  };

  const handleEditContent = async (event) => {
    if (event.target.value !== document.generated_content) {
      const { error } = await supabase
        .from('documents')
        .update({ generated_content: event.target.value })
        .eq('id', document.id);

      if (error) {
        toast.error('Productbeschrijving wijzigen mislukt');
      } else {
        fetchDocument(selectedDocumentId);
        toast.success('Productbeschrijving gewijzigd');
      }
    }
  };

  const handleEditProductCode = async (event) => {
    if (event.target.value !== document.product_code) {
      const { error } = await supabase
        .from('documents')
        .update({ product_code: event.target.value })
        .eq('id', document.id);
      if (error) {
        toast.error('Productcode wijzigen mislukt');
      } else {
        fetchDocument(selectedDocumentId);
        toast.success('Productcode gewijzigd');
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        backgroundColor: 'var(--mui-palette-background-highlight)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          minWidth: 300,
          maxWidth: 300,
          backgroundColor: 'rgba(var(--mui-palette-primary-mainChannel) / var(--mui-palette-action-activatedOpacity))',
          borderRadius: '15px',
          color: 'var(--mui-palette-common-white)',
        }}
      >
        <Stack alignItems="flex-start" direction="column" marginTop={2} marginX={2} spacing={1}>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{
                '&:hover': {
                  backgroundColor: neonBlue['300'],
                },
              }}
            >
              <img alt="open" height="30" src="/assets/icon-back.svg" width="30" />
            </IconButton>
            <Typography sx={{ wordBreak: 'break-all' }} variant="h6">
              Productbeschrijvingen
            </Typography>
          </Box>
          <List component="nav" sx={{}} />
          {documents.map((doc) => {
            return (
              <ListItemButton
                key={doc.id}
                onClick={() => handleSelectDocument(doc.id)}
                sx={{
                  width: '100%',
                  '&:hover': {
                    backgroundColor: neonBlue['700'],
                  },
                  ...(doc.id === selectedDocumentId && {
                    bgcolor: 'var(--mui-palette-primary-main)',
                    color: 'var(--mui-palette-primary-contrastText)',
                  }),
                }}
              >
                <Typography
                  sx={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--mui-palette-common-white)',
                    whiteSpace: 'normal',
                  }}
                  variant="caption"
                >
                  {doc.document_name}
                </Typography>
              </ListItemButton>
            );
          })}
        </Stack>
      </Box>

      <Box
        sx={{
          flexGrow: 3,
          overflowX: 'auto',
          backgroundColor: 'var(--mui-palette-background-level1)',
          borderRadius: '15px',
          padding: 1,
        }}
      >
        <Stack direction="column" spacing={2}>
          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <Typography variant="h5">{document?.document_name}</Typography>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Kopieer naar klembord">
                <IconButton onClick={handleCLipboard} sx={{ backgroundColor: 'var(--mui-palette-background-level3)' }}>
                  <img alt="open" height="25" src="/assets/icon-clipboard.svg" width="25" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Regenereren">
                <IconButton
                  disabled={loadingRegenerate}
                  onClick={handleRegenerate}
                  sx={{ backgroundColor: 'var(--mui-palette-background-level3)' }}
                >
                  <img alt="open" height="25" src="/assets/icon-refresh.svg" width="25" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Downloaden">
                <IconButton
                  disabled={loadingDownload}
                  onClick={handleDownload}
                  sx={{ backgroundColor: 'var(--mui-palette-background-level3)' }}
                >
                  <img alt="open" height="25" src="/assets/icon-download.svg" width="25" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Archiveren">
                <IconButton
                  disabled={loadingArchive}
                  onClick={handleArchive}
                  sx={{ backgroundColor: 'var(--mui-palette-background-level3)' }}
                >
                  <img alt="open" height="25" src="/assets/icon-trash.svg" width="25" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Publiceren">
                <Button
                  color="primary"
                  disabled={loadingPublish}
                  onClick={handlePublish}
                  startIcon={<img alt="spark" height="25" src="/assets/icon-cloud-white-transparant.svg" width="25" />}
                  variant="contained"
                >
                  Publiceren
                </Button>
              </Tooltip>
            </Stack>
          </Stack>
          dd
          <Stack direction="row" spacing={1} sx={{ bgColor: 'var(--mui-palette-background-level3)' }}>
            <div data-color-mode="light" style={{ flexGrow: 1 }}>
              <MDEditor
                height="91vh"
                onBlur={handleEditContent}
                onChange={setValue}
                readOnly={loadingRegenerate}
                value={value}
              />
            </div>
            <Stack direction="column" spacing={1} sx={{ flexGrow: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Stack direction="row">
                  <Typography fontWeight={600} variant="h5">
                    Attributen
                  </Typography>
                </Stack>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ width: '150px' }}>Productcode</Typography>
                  <TextField
                    defaultValue={document?.product_code}
                    onBlur={handleEditProductCode}
                    sx={{ width: '200px' }}
                    variant="filled"
                  />
                </Stack>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ width: '150px' }}>Status</Typography>
                  {document?.is_generated && document?.is_published ? <Published /> : null}
                  {document?.is_generated && !document?.is_published ? <Generated /> : null}
                  {!document?.is_generated && !document?.is_published && <NotGenerated />}
                </Stack>
                {/*<Stack direction="row" alignItems="center" spacing={1}>*/}
                {/*  <Typography sx={{ width: '150px' }}>Bronbestand</Typography>*/}
                {/*  <IconButton disabled sx={{ backgroundColor: 'var(--mui-palette-background-level3)', width: '200px' }}>*/}
                {/*    <img alt="open" height="25" src="/assets/icon-file.svg" width="25" />*/}
                {/*  </IconButton>*/}
                {/*</Stack>*/}
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Typography sx={{ width: '150px' }}>Laatst gewijzigd</Typography>
                  <Typography sx={{ width: '200px' }}>{new Date(document?.updated_at).toLocaleString()}</Typography>
                </Stack>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default DocumentsDetail;
